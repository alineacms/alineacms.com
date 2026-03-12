import {Config} from 'alinea'
import {createCMS} from 'alinea/next'
import {BlogPage} from './entries/blog/BlogPage.schema'
import {PostPage} from './entries/blog/PostPage.schema'
import {SitePage} from './entries/page/SitePage.schema'
import {SiteLayout} from './entries/settings/SiteLayout.schema'

export const cms = createCMS({
  schema: {
    SitePage,
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
          contains: ['SitePage', 'BlogPage'],
          children: {
            index: Config.page({
              type: SitePage,
              fields: {
                title: 'Home',
                path: ''
              }
            }),
            products: Config.page({
              type: SitePage,
              fields: {
                title: 'Products',
                path: 'products'
              },
              children: {
                enterprise: Config.page({
                  type: SitePage,
                  fields: {
                    title: 'Enterprise',
                    path: 'enterprise'
                  }
                })
              }
            }),
            blog: Config.page({
              type: BlogPage,
              fields: {
                title: 'Blog',
                path: 'blog',
                intro: 'Latest posts'
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
    development: 'http://localhost:3105'
  },
  handlerUrl: '/api/cms',
  dashboardFile: 'admin.html',
  preview: true
})
