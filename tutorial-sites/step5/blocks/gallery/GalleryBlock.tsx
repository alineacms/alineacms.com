import {Infer} from 'alinea'
import {GalleryBlock} from './GalleryBlock.schema'

type GalleryBlockData = Infer<typeof GalleryBlock>

export function GalleryBlockView({block}: {block: GalleryBlockData}) {
  return (
    <ul>
      {block.images.map((image, index) => {
        const src = typeof image === 'string' ? image : image?.src || ''
        return src ? (
          <li key={`${src}-${index}`}>
            <img src={src} alt='' />
          </li>
        ) : null
      })}
    </ul>
  )
}
