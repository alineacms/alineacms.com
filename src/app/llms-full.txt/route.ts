import {
  getEntryTitle,
  getLlmsRenderData,
  renderDocBody
} from '@/app/llms/_lib'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

export async function GET() {
  const {docsEntries, entryMap, mediaMap} = await getLlmsRenderData()
  const output: Array<string> = []
  output.push('# Alinea CMS Docs')
  output.push('')

  docsEntries
    .slice()
    .sort((a, b) => a.url.localeCompare(b.url))
    .forEach(entry => {
      output.push(`### ${getEntryTitle(entry)} (${entry.url})`)
      const body = renderDocBody(entry, entryMap, mediaMap)
      if (body) output.push(body)
      output.push('')
    })

  return new Response(output.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8'
    }
  })
}
