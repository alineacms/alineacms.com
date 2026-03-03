import {Entry} from 'alinea/core/Entry'
import {cms} from '../../cms'
import {BlogPageView} from '../../entries/blog/BlogPage'
import {BlogPage} from '../../entries/blog/BlogPage.schema'

export default async function BlogRoute() {
  const page = await cms.get({url: '/blog', type: BlogPage})
  if (!page) return <main>No blog page found</main>

  const posts = await cms.find({
    parentId: page._id,
    select: {
      id: Entry.id,
      title: Entry.title,
      url: Entry.url
    }
  })

  return <BlogPageView page={page} posts={posts} />
}
