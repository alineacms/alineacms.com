import {Infer} from 'alinea'
import {LandingPage} from './LandingPage.schema'

type LandingData = Infer<typeof LandingPage>

export function LandingPageView({page}: {page: LandingData}) {
  return <h1>{page.title}</h1>
}
