import {Config, Field} from 'alinea'

export const FeaturesBlock = Config.type('Features', {
  fields: {
    items: Field.list('Items', {
      schema: {
        FeatureItem: Config.type('Item', {
          fields: {
            icon: Field.select('Icon', {
              width: 0.25,
              options: {
                IcRoundFastForward: 'IcRoundFastForward',
                MdiSourceBranch: 'MdiSourceBranch',
                MdiLanguageTypescript: 'MdiLanguageTypescript'
              }
            }),
            title: Field.text('Title', {
              width: 0.75
            }),
            description: Field.richText('Description')
          }
        })
      }
    })
  }
})
