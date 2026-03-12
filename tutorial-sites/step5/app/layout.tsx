import {cms} from '../cms'
import {SiteFooter, SiteHeader} from '../entries/settings/SiteLayout'
import {SiteLayout as SiteLayoutEntry} from '../entries/settings/SiteLayout.schema'

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const settings = await cms.get({
    root: cms.workspaces.main.settings,
    type: SiteLayoutEntry
  })

  return (
    <html lang='en'>
      <body>
        {settings ? <SiteHeader settings={settings} /> : null}
        {children}
        {settings ? <SiteFooter settings={settings} /> : null}
      </body>
    </html>
  )
}
