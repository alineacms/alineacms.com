import {Config, Field} from 'alinea'

export const SiteLayout = Config.document('Site layout', {
  fields: {
    title: Field.text('Entry title', {initialValue: 'Global settings'}),
    path: Field.path('Path', {readOnly: true, initialValue: 'settings'}),
    headerText: Field.text('Header text', {required: true}),
    footerText: Field.text('Footer text', {required: true})
  }
})
