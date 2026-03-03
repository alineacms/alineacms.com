import {Entry} from 'alinea/core/Entry'
import {notFound} from 'next/navigation'
import {cms} from '../../cms'
import {BlogPageView} from '../../entries/blog/BlogPage'
import {BlogPostPageView} from '../../entries/blog/BlogPostPage'
import {BlogPage} from '../../entries/blog/BlogPage.schema'
import {SitePageView} from '../../entries/page/SitePage'
import {SitePage} from '../../entries/page/SitePage.schema'

interface RouteProps {
  params: Promise<{slug?: Array<string>}>
}

export async function generateStaticParams() {
  const urls = await cms.find({
    root: cms.workspaces.main.pages,
    select: Entry.url
  })

  return urls.map(url => ({slug: url === '/' ? [] : url.slice(1).split('/')}))
}

export default async function CatchAllPage({params}: RouteProps) {
  const {slug = []} = await params
  const url = slug.length > 0 ? `/${slug.join('/')}` : '/'
  const page = await cms.get({url})

  if (!page) notFound()

  if (page._type === 'BlogPage') {
    const blogPage = await cms.get({url, type: BlogPage})
    if (!blogPage) notFound()
    const posts = await cms.find({
      parentId: blogPage._id,
      select: {
        id: Entry.id,
        title: Entry.title,
        url: Entry.url
      }
    })
    return <BlogPageView page={blogPage} posts={posts} />
  }

  if (page._type === 'PostPage') {
    const postSlug = slug[slug.length - 1]
    if (!postSlug) notFound()
    return <BlogPostPageView slug={postSlug} />
  }

  const sitePage = await cms.get({url, type: SitePage})
  if (!sitePage) notFound()
  return <SitePageView page={sitePage} />
}
