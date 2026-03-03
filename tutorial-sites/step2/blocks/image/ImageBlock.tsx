import {Infer} from 'alinea'
import {ImageBlock} from './ImageBlock.schema'

type ImageBlockData = Infer<typeof ImageBlock>

export function ImageBlockView({block}: {block: ImageBlockData}) {
  const src = typeof block.image === 'string' ? block.image : block.image?.src || ''
  return src ? <img src={src} alt={block.alt || ''} /> : null
}
