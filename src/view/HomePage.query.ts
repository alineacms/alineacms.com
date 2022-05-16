import {Store} from '@alinea/store'
import {Home, Pages} from '../../.alinea/web'

export async function homePageQuery(pages: Pages, home: Home) {
  const action = home.action[0]
  return {
    ...home,
    action: home.action
    /*action?.type === 'entry'
        ? {
            url: (await pages.whereId(action.entry))!.url,
            label: action.label
          }
        : null*/
  }
}

export type HomePageProps = Store.TypeOf<ReturnType<typeof homePageQuery>>
