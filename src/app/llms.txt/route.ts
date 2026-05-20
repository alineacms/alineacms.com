import {getDocsEntries, getEntryTitle, toLlmsMdPath} from '@/app/llms/_lib'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

export async function GET() {
  const docsEntries = await getDocsEntries()
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
      output.push(`- [${title}](${toLlmsMdPath(entry.url)})`)
    })

  output.push('')
  return new Response(output.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8'
    }
  })
}
