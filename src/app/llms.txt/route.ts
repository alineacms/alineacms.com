import {
  getEntryTitle,
  getLlmsRenderData,
  renderDocBody,
  toLlmsMdPath
} from '@/app/llms/_lib'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

function getEntryDescription(
  entry: Parameters<typeof getEntryTitle>[0],
  entryMap: Map<string, {url: string}>,
  mediaMap: Map<string, {title: string; location: string}>
) {
  const body = renderDocBody(entry, entryMap, mediaMap)
  if (!body) return ''
  const line = body
    .split('\n')
    .map(textLine => textLine.trim())
    .find(
      line =>
        line &&
        !line.startsWith('#') &&
        !line.startsWith('```') &&
        !line.startsWith('File:') &&
        !line.startsWith('Variant:') &&
        !line.startsWith('Framework:')
    )
  if (!line) return ''
  const firstSentence =
    line.match(/^(.*?[.!?])(?:\s|[\)\]\"']|$)/)?.[1] || line
  return firstSentence.trim()
}

export async function GET() {
  const {docsEntries, entryMap, mediaMap} = await getLlmsRenderData()
  const output: Array<string> = []
  output.push('# Alinea CMS Docs')
  output.push('')
  output.push('Full documentation: /llms-full.txt')
  output.push('')
  output.push('## Pages')
  output.push('')

  docsEntries
    .slice()
    .sort((a, b) => a.url.localeCompare(b.url))
    .forEach(entry => {
      const title = getEntryTitle(entry)
      const description = getEntryDescription(entry, entryMap, mediaMap)
      output.push(
        description
          ? `- [${title}](${toLlmsMdPath(entry.url)}): ${description}`
          : `- [${title}](${toLlmsMdPath(entry.url)})`
      )
    })

  output.push('')
  return new Response(output.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8'
    }
  })
}
