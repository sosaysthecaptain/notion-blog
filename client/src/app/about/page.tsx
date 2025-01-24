export default function About() {
  return (
    <div className="about-content">
      <h1>About</h1>

      <p>
        Engineer and builder focused on hardware projects and software systems. With a background
        in mechanical engineering and computer science, I work on projects ranging from optical
        measurement systems to automated trading platforms.
      </p>

      <h2>Current Work</h2>
      <p>
        Currently developing high-precision measurement systems and exploring applications
        of machine learning in hardware control systems. My recent projects include
        the optical profilometer and various robotics applications.
      </p>

      <h3>Technical Interests</h3>
      <p>
        My work spans several areas:
      </p>

      <pre><code>
        {code_block}
      </code></pre>

      <h2>Contact</h2>
      <p>
        Feel free to reach out through <a href="https://github.com/sosaysthecaptain">GitHub</a>
        for collaboration opportunities or questions about any of my projects.
      </p>
    </div>
  )
}

const code_block = `
export async function getRecentPosts(count: number = 3): Promise<BlogPost[]> {
  debugger
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
}`