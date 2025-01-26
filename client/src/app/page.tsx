'use client'
import { useState, useEffect } from 'react'
import { fetchRecentBlogPosts } from '@/lib/api'
import { BlogPost } from '@/types'
import Link from 'next/link'

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const { posts: newPosts } = await fetchRecentBlogPosts(5);
        setPosts(newPosts);
      } catch (err) {
        setError('Failed to load posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <section>
        <h2 className="h2">Recent Posts</h2>
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.id}>
              <h3>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>
              {post.publishedAt && (
                <div className="subheader-date">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
              )}
              {post.excerpt && <p>{post.excerpt}</p>}
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}