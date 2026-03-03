import {Infer} from 'alinea'
import {SiteLayout as SiteLayoutEntry} from './SiteLayout.schema'

type SiteLayoutProps = Infer<typeof SiteLayoutEntry>

export function SiteHeader({settings}: {settings: SiteLayoutProps}) {
  return <header>{settings.headerText}</header>
}

export function SiteFooter({settings}: {settings: SiteLayoutProps}) {
  return <footer>{settings.footerText}</footer>
}
