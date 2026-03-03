import {Infer} from 'alinea'
import {RichText} from 'alinea/ui'
import {TextBlock} from './TextBlock.schema'

type TextBlockData = Infer<typeof TextBlock>

export function TextBlockView({block}: {block: TextBlockData}) {
  return <RichText doc={block.body} />
}
