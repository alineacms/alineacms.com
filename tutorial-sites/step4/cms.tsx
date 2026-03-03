import {Config} from 'alinea'
import {createCMS} from 'alinea/next'
import {BlogPage} from './entries/blog/BlogPage.schema'
import {PostPage} from './entries/blog/PostPage.schema'
import {LandingPage} from './entries/landing/LandingPage.schema'
import {SiteLayout} from './entries/settings/SiteLayout.schema'

export const cms = createCMS({
  schema: {
    LandingPage,
    SiteLayout,
    BlogPage,
    PostPage
  },
  workspaces: {
    main: Config.workspace('Main', {
      source: 'content',
      mediaDir: 'public',
      roots: {
        pages: Config.root('Pages', {
          contains: ['LandingPage', 'BlogPage'],
          children: {
            index: Config.page({
              type: LandingPage,
              fields: {
                title: 'Welcome',
                path: ''
              }
            }),
            blog: Config.page({
              type: BlogPage,
              fields: {
                title: 'Blog',
                path: 'blog',
                intro: 'Latest posts'
              },
              children: {
                'hello-world': Config.page({
                  type: PostPage,
                  fields: {
                    title: 'Hello world',
                    path: 'hello-world',
                    excerpt: 'My first post',
                    body: 'Welcome to the blog'
                  }
                })
              }
            })
          }
        }),
        globals: Config.root('Globals', {
          contains: ['SiteLayout'],
          children: {
            settings: Config.page({
              type: SiteLayout,
              fields: {
                title: 'Global settings',
                path: 'settings',
                headerText: 'My website',
                footerText: 'Copyright 2026'
              }
            })
          }
        }),
        media: Config.media()
      }
    })
  },
  baseUrl: {
    development: 'http://localhost:3104'
  },
  handlerUrl: '/api/cms',
  dashboardFile: 'admin.html',
  preview: true
})
