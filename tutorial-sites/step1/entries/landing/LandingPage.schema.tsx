import {Config, Field} from 'alinea'

export const LandingPage = Config.document('Landing page', {
  fields: {
    title: Field.text('Title', {required: true}),
    path: Field.path('Path', {readOnly: true, initialValue: ''})
  }
})
