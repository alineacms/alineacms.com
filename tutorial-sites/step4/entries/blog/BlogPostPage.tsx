import {Infer} from 'alinea'
import {PostPage} from './PostPage.schema'

type PostData = Infer<typeof PostPage>

export function BlogPostPageView({post}: {post: PostData}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  )
}
