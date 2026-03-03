import {Config, Field} from 'alinea'

export const ImageBlock = Config.type('Image block', {
  fields: {
    image: Field.image('Image', {required: true}),
    alt: Field.text('Alt text')
  }
})
