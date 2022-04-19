import {TextDoc, TextNode, TypesOf} from '@alinea/core'
import {fromModule} from '@alinea/ui'
import {ComponentType, Fragment} from 'react'
import reactStringReplace from 'react-string-replace'
import css from './RichText.module.scss'

const styles = fromModule(css)

function getTag(type: string, attributes: Record<string, any> | undefined) {
  switch (type) {
    case 'heading':
      return `h${attributes?.level || 1}`
    case 'bold':
      return 'b'
    case 'italic':
      return 'i'
    case 'paragraph':
      return 'p'
    case 'bulletList':
      return 'ul'
    case 'listItem':
      return 'li'
  }
}

function RichTextNodeView<T>(node: TextNode<T>) {
  switch (node.type) {
    case 'text': {
      const {text, marks} = node as TextNode.Text
      const content = reactStringReplace(text, /\`(.+?)\`/g, (match, i) => (
        <span className={styles.code()} key={i}>
          {match}
        </span>
      ))
      const wrappers =
        marks?.map(mark => getTag(mark.type, mark.attrs) || Fragment) || []
      return wrappers.reduce((children, Tag) => {
        return <Tag>{children}</Tag>
      }, <>{content}</>)
    }
    default: {
      const {type, content, ...attrs} = node as TextNode.Element
      const Tag = getTag(type, attrs) || Fragment
      return (
        <Tag>
          {content?.map((node, i) => (
            <RichTextNodeView key={i} {...node} />
          )) || <br />}
        </Tag>
      )
    }
  }
}

export type RichTextProps<T> = {
  doc: TextDoc<T>
  view?: Partial<{
    [K in TypesOf<T>]: ComponentType<Extract<T, {type: K}>>
  }>
}

export function RichText<T>({doc, view}: RichTextProps<T>) {
  const custom: Record<string, any> = view || {}
  if (!Array.isArray(doc)) return null
  return (
    <>
      {doc.map((node, i) => {
        const Custom = custom[node.type]
        if (Custom) return <Custom key={i} {...node} />
        return <RichTextNodeView key={i} {...node} />
      })}
    </>
  )
}
