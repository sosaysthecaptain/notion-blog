import { BlogPost } from '@/types'

const FUNCTION_BASE_URL = 'https://us-central1-notion-blog-1d154.cloudfunctions.net';

export async function fetchRecentBlogPosts(count: number = 3, cursor?: string) {
  try {
    const response = await fetch(`${FUNCTION_BASE_URL}/getRecentBlogPosts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { count, cursor } })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await response.json();
    debugger
    return data.result;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], next_cursor: null, has_more: false };
  }
}