/*
firebase functions:secrets:set NOTION_API_KEY
firebase functions:secrets:set NOTION_DATABASE_ID
firebase functions:secrets:get
*/

import * as functions from "firebase-functions/v2"; // <-- V2 IMPORT
import { setGlobalOptions } from "firebase-functions/v2";
import * as logger from "firebase-functions/logger"; // <-- V2 LOGGER
// import cors from "cors";
import { Client } from "@notionhq/client";

// Set global Firebase options
setGlobalOptions({
  region: "us-central1",
  maxInstances: 3,
});

// ========== Helper Functions ==========
const getConfig = () => {
  return {
    notionApiKey: process.env.NOTION_API_KEY || "",
    notionDbId: process.env.NOTION_DATABASE_ID || "",
  };
};

const validateConfig = () => {
  const config = getConfig();
  logger.log("Environment config check:", {
    hasApiKey: !!config.notionApiKey,
    hasDbId: !!config.notionDbId,
  });

  if (!config.notionApiKey || !config.notionDbId) {
    throw new Error("Missing Notion configuration in environment variables");
  }
};

// ========== Cloud Functions ==========
export const getRecentBlogPosts = functions.https.onRequest(
  {
    cors: true, // <-- Built-in CORS handling
    secrets: ["NOTION_API_KEY", "NOTION_DATABASE_ID"],
    memory: "256MiB",
  },
  async (request, response) => {
    logger.log("getRecentBlogPosts execution started");

    try {
      validateConfig();
      const { notionApiKey, notionDbId } = getConfig();

      if (request.method !== "POST") {
        logger.error("Invalid method", { method: request.method });
        response.status(405).send({ error: "Method not allowed" });
        return;
      }

      const notion = new Client({ auth: notionApiKey });
      logger.log("Notion client initialized");

      const { count = 3, cursor } = request.body?.data || {};
      logger.log("Request parameters:", { count, cursor });

      const queryParams = {
        database_id: notionDbId,
        filter: {
          property: "published",
          checkbox: { equals: true },
        },
        sorts: [{
          property: "publication_date",
          direction: "descending",
        }],
        page_size: Math.min(Math.max(1, count), 100),
        ...(cursor && { start_cursor: cursor }),
      };

      logger.debug("Query params:", queryParams);
      const notionResponse = await notion.databases.query(queryParams);
      logger.log(`Found ${notionResponse.results.length} pages`);

      const posts = notionResponse.results.map((page: any) => ({
        id: page.id,
        title: page.properties.Name.title[0]?.plain_text || "Untitled",
        slug: page.properties.slug.rich_text[0]?.plain_text || "",
        publishedAt: page.properties.publication_date?.date?.start || "",
        created: page.created_time,
        excerpt: page.properties.excerpt?.rich_text[0]?.plain_text || "",
        thumbnail: page.properties.thumbnail?.url || "",
      }));

      response.json({
        result: {
          posts,
          next_cursor: notionResponse.next_cursor,
          has_more: notionResponse.has_more,
        }
      });

    } catch (error: any) {
      logger.error("CRASHED:", error);
      response.status(500).json({
        error: {
          code: error.code || "internal",
          message: error.message || "Unknown error",
          details: error.details || undefined,
        }
      });
    }
  }
);

export const getBlogPost = functions.https.onRequest(
  {
    cors: true,
    secrets: ["NOTION_API_KEY", "NOTION_DATABASE_ID"],
    memory: "256MiB"
  },
  async (request, response) => {
    try {
      validateConfig();
      const { notionApiKey } = getConfig();

      if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method not allowed' });
        return;
      }

      const { slug } = request.body.data;
      const notion = new Client({ auth: notionApiKey });

      // Search for page with matching slug
      const searchResponse = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID || '',
        filter: {
          property: "slug",
          rich_text: { equals: slug }
        }
      });

      if (searchResponse.results.length === 0) {
        response.status(404).json({ error: 'Post not found' });
        return;
      }

      const page = searchResponse.results[0];
      const blocks = await notion.blocks.children.list({ block_id: page.id });

      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json({
        result: {
          ...page,
          content: blocks.results
        }
      });

    } catch (error: any) {
      logger.error("Error in getBlogPost:", error);
      response.status(500).json({
        error: error.message
      });
    }
  }
);
