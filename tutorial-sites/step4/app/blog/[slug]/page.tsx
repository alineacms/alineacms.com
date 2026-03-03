import {Entry} from 'alinea/core/Entry'
import {notFound} from 'next/navigation'
import {cms} from '../../../cms'
import {BlogPostPageView} from '../../../entries/blog/BlogPostPage'
import {PostPage} from '../../../entries/blog/PostPage.schema'

export async function generateStaticParams() {
  const urls = await cms.find({
    type: PostPage,
    select: Entry.url
  })

  return urls.map(url => ({slug: url.split('/').filter(Boolean).pop() || ''}))
}

interface PostRouteProps {
  params: Promise<{slug: string}>
}

export default async function BlogPostRoute({params}: PostRouteProps) {
  const {slug} = await params
  const post = await cms.get({url: `/blog/${slug}`, type: PostPage})
  if (!post) notFound()
  return <BlogPostPageView post={post} />
}
