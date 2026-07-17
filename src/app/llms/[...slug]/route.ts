import {
  getEntryTitle,
  getLlmsRenderData,
  renderDocBody,
  siteUrl
} from '@/app/llms/_lib'

export const runtime = 'nodejs'

type RouteContext = {
  params: Promise<{
    slug?: Array<string>
  }>
}

function decodeSlug(slug: Array<string>) {
  if (slug.length === 0) return null
  const segments: Array<string> = []
  for (let index = 0; index < slug.length; index++) {
    const segment = slug[index]
    let decoded = ''
    try {
      decoded = decodeURIComponent(segment)
    } catch {
      return null
    }
    if (index === slug.length - 1) {
      if (!decoded.endsWith('.md')) return null
      decoded = decoded.slice(0, -3)
    }
    if (
      !decoded ||
      decoded === '.' ||
      decoded === '..' ||
      decoded.includes('/') ||
      decoded.includes('\\')
    ) {
      return null
    }
    segments.push(decoded)
  }
  return segments
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params
  const decodedSlug = decodeSlug(params.slug ?? [])
  if (!decodedSlug) return new Response('Not found', {status: 404})
  const url = `/${decodedSlug.join('/')}`
  if (!url.startsWith('/docs')) {
    return new Response('Not found', {status: 404})
  }

  const {docsEntries, entryMap, mediaMap} = await getLlmsRenderData()
  const entry = docsEntries.find(doc => doc.url === url)
  if (!entry) return new Response('Not found', {status: 404})

  const output: Array<string> = []
  output.push(`# ${getEntryTitle(entry)}`)
  output.push('')
  output.push(`Source: ${siteUrl}${entry.url}`)
  output.push('')
  const body = renderDocBody(entry, entryMap, mediaMap)
  if (body) output.push(body)
  output.push('')

  return new Response(output.join('\n'), {
    headers: {
      'content-type': 'text/markdown; charset=utf-8'
    }
  })
}
