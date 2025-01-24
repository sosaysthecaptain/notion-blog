/*
firebase functions:config:set notion.api_key="xxx"
firebase functions:config:set notion.database_id="xxx"
*/


import * as functions from "firebase-functions";
import {Client} from "@notionhq/client";

const NOTION_API_KEY = process.env.NOTION_API_KEY || '';
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || '';

const notion = new Client({
  auth: NOTION_API_KEY,
});

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  created: string;
  excerpt?: string;
  thumbnail?: string;
  content?: string;
}

export const getRecentBlogPosts = functions.https.onCall(async (data: any, context) => {
  const {count = 3, cursor} = data;

  try {
    const queryParams: any = {
      database_id: NOTION_DATABASE_ID!,
      filter: {
        property: "published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "publication_date",
          direction: "descending",
        },
      ],
      page_size: count,
    };

    // Add cursor if provided
    if (cursor) {
      queryParams.start_cursor = cursor;
    }

    const response = await notion.databases.query(queryParams);

    const posts = response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Name.title[0]?.plain_text || "Untitled",
      slug: page.properties.slug.rich_text[0]?.plain_text || "",
      publishedAt: page.properties.publication_date?.date?.start || "",
      created: page.created_time,
      excerpt: page.properties.excerpt?.rich_text[0]?.plain_text || "",
      thumbnail: page.properties.thumbnail?.url || "",
    }));

    return {
      posts,
      next_cursor: response.next_cursor,
      has_more: response.has_more,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new functions.https.HttpsError("internal", "Error fetching posts");
  }
});

export const getBlogPost = functions.https.onCall(async (data: any, context) => {
  const {slug} = data;

  try {
    // First query the database to find the page by slug
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        and: [
          {
            property: "slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    if (!response.results.length) {
      throw new functions.https.HttpsError("not-found", "Post not found");
    }

    const page = response.results[0] as any;

    // Get the full page content
    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    });

    // Basic post metadata
    const post: BlogPost = {
      id: page.id,
      title: page.properties.Name.title[0]?.plain_text || "Untitled",
      slug: page.properties.slug.rich_text[0]?.plain_text || "",
      publishedAt: page.properties.publication_date?.date?.start || "",
      created: page.created_time,
      excerpt: page.properties.excerpt?.rich_text[0]?.plain_text || "",
      thumbnail: page.properties.thumbnail?.url || "",
      content: JSON.stringify(blocks), // We'll parse this on the frontend
    };

    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new functions.https.HttpsError("internal", "Error fetching post");
  }
});
