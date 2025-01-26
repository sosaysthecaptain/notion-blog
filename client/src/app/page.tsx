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

  if (loading) return (
    <div className="page-container">
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-6 bg-gray-200 w-3/4" />
            <div className="h-4 bg-gray-200 w-1/4" />
            <div className="h-48 bg-gray-200" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200" />
              <div className="h-4 bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="page-container">
      <div className="text-red-600">Error: {error}</div>
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Blog</h1>
      <div style={{marginBottom: 40}}>This is some text</div>


      <div className="blog-posts">
        {posts.map((post, index) => (
          <article key={post.id} className="blog-post">
            <h1 className="post-title">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h1>
            {post.publishedAt && (
              <div className="post-date">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
            <div className="post-divider"></div>
            {post.thumbnail && (post.thumbnail.endsWith('.png') || post.thumbnail.endsWith('.jpg')) && (
              <div className="post-image-container">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="post-image"
                />
              </div>
            )}
            {post.excerpt && (
              <p className="post-excerpt">
                {post.excerpt}
              </p>
            )}
            <Link
              href={`/blog/${post.slug}`}
              className="read-more"
            >
              Read more...
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}