import {supportedFrameworks} from '@/layout/nav/Frameworks'
import styler from '@alinea/styler'
import {Infer} from 'alinea'
import {RenderSelectedFramework} from './FrameworkBlockView.client'
import css from './FrameworkBlockView.module.scss'
import {TextFieldView} from './TextFieldView'
import {FeaturesBlock} from '@/schema/blocks/FeaturesBlock'
import {Feature, Features} from '@/layout/Features'
import {WebTypo} from '@/layout/WebTypo'
import {WebText} from '@/layout/WebText'
import {
  IcBaselineCloudQueue,
  IcBaselineDashboardCustomize,
  IcBaselineWorkspaces,
  IcRoundFastForward,
  MdiLanguageTypescript,
  MdiSourceBranch
} from '@/icons'

const styles = styler(css)

type FeatureItem = Infer<typeof FeaturesBlock>['items'][number]
function getIcon(iconName: FeatureItem['icon']) {
  switch (iconName) {
    case 'IcRoundFastForward':
      return IcRoundFastForward
    case 'MdiSourceBranch':
      return MdiSourceBranch
    case 'MdiLanguageTypescript':
      return MdiLanguageTypescript
    default:
      return undefined
  }
}

export function FeaturesBlockView({items}: Infer<typeof FeaturesBlock>) {
  if (!items || items.length === 0) return null
  return (
    <section className={styles.root()}>
      <Features>
        {items.map((feature, index) => (
          <Feature key={index}>
            <WebTypo>
              <Feature.Title icon={getIcon(feature.icon)}>
                {feature.title}
              </Feature.Title>
              <WebText doc={feature.description} />
            </WebTypo>
          </Feature>
        ))}
      </Features>
    </section>
  )
}
