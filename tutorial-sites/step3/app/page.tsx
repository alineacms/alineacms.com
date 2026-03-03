import {cms} from '../cms'
import {LandingPageView} from '../entries/landing/LandingPage'
import {LandingPage} from '../entries/landing/LandingPage.schema'

export default async function Page() {
  const page = await cms.get({url: '/', type: LandingPage})
  if (!page) return <main>No landing page found</main>
  return <LandingPageView page={page} />
}
