import {Entry} from 'alinea/core/Entry'
import {cms} from '../../../cms'
import {BlogPostPageView} from '../../../entries/blog/BlogPostPage'
import {PostPage} from '../../../entries/blog/PostPage.schema'

export async function generateStaticParams() {
  const paths = await cms.find({
    type: PostPage,
    select: Entry.path
  })

  return paths.map(slug => ({slug}))
}

interface PostRouteProps {
  params: Promise<{slug: string}>
}

export default async function BlogPostRoute({params}: PostRouteProps) {
  const {slug} = await params
  return <BlogPostPageView slug={slug} />
}
