// app/blog/[slug]/page.tsx
'use client' // ← Add this directive

import { renderNotionBlocks } from '@/lib/notionRenderer';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchBlogPostBySlug } from '@/lib/api'
import { BlogPost } from '@/types'

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchBlogPostBySlug(params.slug);
        if (!data) {
          router.replace('/404');
          return;
        }

        // Add type assertion if needed
        // debugger
        // const r = renderNotionBlocks(data.content)
        // console.log(r)
        // debugger


        const processedPost: any = {
          ...data,
          content: Array.isArray(data.content)
            ? renderNotionBlocks(data.content)
            : ''
        };

        setPost(processedPost);
      } catch (error) {
        console.error('Failed to load post:', error);
        router.replace('/404');
      } finally {
        setLoading(false);
      }
    }

    loadPost()
  }, [params.slug, router])

  if (loading) return <div>Loading...</div>

  return (
    <article className="max-w-2xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-4">{post?.title}</h1>
      {post?.publishedAt && (
        <p className="text-gray-500 mb-6">
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>
      )}
      <div
        className="prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post?.content || '' }}
      />
    </article>
  )
}