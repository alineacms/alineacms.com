import {Config, Field} from 'alinea'
import {GalleryBlock} from '../../blocks/gallery/GalleryBlock.schema'
import {ImageBlock} from '../../blocks/image/ImageBlock.schema'
import {TextBlock} from '../../blocks/text/TextBlock.schema'

export const LandingPage = Config.document('Landing page', {
  fields: {
    title: Field.text('Title', {required: true}),
    path: Field.path('Path', {readOnly: true, initialValue: ''}),
    blocks: Field.list('Blocks', {
      schema: {
        TextBlock,
        ImageBlock,
        GalleryBlock
      }
    })
  }
})
