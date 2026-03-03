import {Config, Field} from 'alinea'

export const BlogPage = Config.document('Blog page', {
  contains: ['PostPage'],
  fields: {
    title: Field.text('Title', {required: true}),
    path: Field.path('Path', {readOnly: true, initialValue: 'blog'}),
    intro: Field.text('Intro', {multiline: true})
  }
})
