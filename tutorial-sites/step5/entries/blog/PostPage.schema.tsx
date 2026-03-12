import {Config, Field} from 'alinea'

export const PostPage = Config.document('Post page', {
  fields: {
    title: Field.text('Title', {required: true}),
    path: Field.path('Path', {required: true}),
    excerpt: Field.text('Excerpt', {multiline: true}),
    body: Field.richText('Body')
  }
})
