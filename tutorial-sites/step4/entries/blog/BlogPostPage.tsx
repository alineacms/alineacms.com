import {Entry} from 'alinea/core/Entry'
import {notFound} from 'next/navigation'
import {cms} from '../../cms'
import {PostPage} from './PostPage.schema'

type PostLink = {id: string; title: string; url: string; path: string}

export async function BlogPostPageView({slug}: {slug: string}) {
  const post = await cms.get({url: `/blog/${slug}`, type: PostPage})
  if (!post) notFound()
  const blogPage = (await cms.get({url: '/blog'}))!

  const siblings = await cms.find({
    parentId: blogPage._id,
    select: {
      id: Entry.id,
      title: Entry.title,
      url: Entry.url,
      path: Entry.path
    }
  })

  const index = siblings.findIndex(candidate => candidate.path === slug)
  const previousPost: PostLink | null = index > 0 ? siblings[index - 1] : null
  const nextPost: PostLink | null =
    index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {(previousPost || nextPost) && (
        <nav aria-label="Post navigation">
          <h2>Next/Previous blogpost</h2>
          <ul>
            {previousPost && (
              <li>
                <a href={previousPost.url}>Previous: {previousPost.title}</a>
              </li>
            )}
            {nextPost && (
              <li>
                <a href={nextPost.url}>Next: {nextPost.title}</a>
              </li>
            )}
          </ul>
        </nav>
      )}
    </article>
  )
}
