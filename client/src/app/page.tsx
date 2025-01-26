'use client'

import { useState, useEffect } from 'react'
import { fetchRecentBlogPosts } from '@/lib/api'
import { BlogPost } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-48 bg-gray-200 rounded" />
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-red-600">
      Error: {error}
    </div>
  );

  posts.forEach((post) => {
    console.log(post.title)
    console.log(post.thumbnail)
  })
  debugger

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* <h2 className="h2">Recent Projects</h2> */}
      <div className="space-y-12">
        {posts.map((post) => (
          <article key={post.id} className="group">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative aspect-[16/9] mb-4 overflow-hidden rounded">
                {post.thumbnail && post.thumbnail?.includes('.png') ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              <h3 className="text-[rgb(86,158,80)] text-xl font-bold mb-2 group-hover:underline">
                {post.title}
              </h3>
              {post.publishedAt && (
                <div className="text-[rgb(171,171,168)] text-sm mb-3">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
              {post.excerpt && (
                <p className="text-[rgb(51,51,51)] line-clamp-3">
                  {post.excerpt}
                </p>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}