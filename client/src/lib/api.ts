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
    return data.result;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], next_cursor: null, has_more: false };
  }
}

export async function fetchBlogPostBySlug(slug: string) {
  try {
    const response = await fetch(`${FUNCTION_BASE_URL}/getBlogPost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { slug } })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.result) {
      throw new Error('Post not found');
    }

    return data.result as BlogPost;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}