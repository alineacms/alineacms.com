import {Config} from 'alinea'
import {createCMS} from 'alinea/next'
import {LandingPage} from './entries/landing/LandingPage.schema'
import {SiteLayout} from './entries/settings/SiteLayout.schema'

export const cms = createCMS({
  schema: {
    LandingPage,
    SiteLayout
  },
  workspaces: {
    main: Config.workspace('Main', {
      source: 'content',
      mediaDir: 'public',
      roots: {
        pages: Config.root('Pages', {
          contains: ['LandingPage'],
          children: {
            index: Config.page({
              type: LandingPage,
              fields: {
                title: 'Welcome',
                path: ''
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
    development: 'http://localhost:3103'
  },
  handlerUrl: '/api/cms',
  dashboardFile: 'admin.html',
  preview: true
})
