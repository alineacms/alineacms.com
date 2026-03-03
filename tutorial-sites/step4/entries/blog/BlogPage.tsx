import {Infer} from 'alinea'
import {BlogPage} from './BlogPage.schema'

type BlogData = Infer<typeof BlogPage>

export function BlogPageView({
  page,
  posts
}: {
  page: BlogData
  posts: Array<{id: string; title: string; url: string}>
}) {
  return (
    <main>
      <h1>{page.title}</h1>
      {page.intro ? <p>{page.intro}</p> : null}
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <a href={post.url}>{post.title}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}
