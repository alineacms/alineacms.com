import {
  getEntryTitle,
  getLlmsRenderData,
  renderDocBody,
  siteUrl
} from '@/app/llms/_lib'

export const runtime = 'nodejs'

type RouteContext = {
  params: Promise<{
    slug: Array<string>
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params
  const slug = params.slug ?? []
  const url = `/${slug.map(decodeURIComponent).join('/')}`
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
