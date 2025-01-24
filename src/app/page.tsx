import { getRecentPosts } from '@/lib/notion'

export default async function Home() {
  const recentPosts = await getRecentPosts(3)

  return (
    <div>
      <section>
        <h2 className="h2">Recent Posts</h2>
        <div className="space-y-8">
          {recentPosts.map((post) => (
            <article key={post.id}>
              <h3>
                <a href={`/blog/${post.slug}`}>{post.title}</a>
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