import styler from '@alinea/styler'
import type {UrlReference} from 'alinea'
import {HStack} from 'alinea/ui'
import css from './BlogPostMeta.module.scss'

const styles = styler(css)

export interface BlogPostMetaProps {
  publishDate: string
  author?: {
    url: UrlReference
    avatar?: UrlReference
    name: string
  }
}

export function BlogPostMeta({publishDate, author}: BlogPostMetaProps) {
  const date = publishDate ? new Date(publishDate) : new Date()
  const formattedDate = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
  return (
    <HStack className={styles.root()} gap={8} align="flex-start">
      {author && (
        <HStack center gap={8}>
          By
          <a href={author.url._url} className={styles.root.author.url()}>
            <HStack center gap={8}>
              {author.avatar?._url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Author avatar"
                  className={styles.root.author.avatar()}
                  src={author.avatar._url}
                />
              )}
              {author.name}
            </HStack>
          </a>
        </HStack>
      )}
      <time>— {formattedDate}</time>
    </HStack>
  )
}
