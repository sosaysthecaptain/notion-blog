import { Client } from '@notionhq/client'
import { BlogPost } from '@/types'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export async function getRecentPosts(count: number = 3): Promise<BlogPost[]> {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: 'published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'publication_date',
          direction: 'descending',
        },
      ],
      page_size: count,
    });
    debugger

    const posts = response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Name.title[0]?.plain_text || 'Untitled',
      slug: page.properties.slug.rich_text[0]?.plain_text || '',
      publishedAt: page.properties.publication_date?.date?.start || '',
      created: page.created_time,
      excerpt: page.properties.excerpt?.rich_text[0]?.plain_text || '',
      thumbnail: page.properties.thumbnail?.url || '',
    }));

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}