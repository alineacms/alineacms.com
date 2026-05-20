export const dynamic = 'force-static'

const content = `# Alinea CMS

> Content management for developers.

See the complete documentation corpus at: https://alineacms.com/llms-full.txt

## Key links

- Docs: https://alineacms.com/docs
- Blog: https://alineacms.com/blog
- Changelog: https://alineacms.com/changelog
- Repository: https://github.com/alineacms/alineacms.com
`

export function GET() {
  return new Response(content, {
    headers: {
      'content-type': 'text/plain; charset=utf-8'
    }
  })
}
