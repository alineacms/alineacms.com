import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {cms} from '@/cms'
import {ImageBlockView} from '@/blocks/image/ImageBlock'
import {TextBlockView} from '@/blocks/text/TextBlock'
import {WeatherBlockView} from '@/blocks/weather/WeatherBlock'
import {LandingPage} from './LandingPage.schema'

export async function LandingPageView() {
  const page = await cms.get({url: '/', type: LandingPage})
  if (!page) notFound()

  return (
    <main>
      <h1>{page.title}</h1>
      {page.blocks.map(block => {
        if (block._type === 'TextBlock') return <TextBlockView key={block._id} block={block} />
        if (block._type === 'ImageBlock') return <ImageBlockView key={block._id} block={block} />
        if (block._type === 'WeatherBlock') return <WeatherBlockView key={block._id} block={block} />
        return null
      })}
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await cms.get({url: '/', type: LandingPage})
  if (!page) return {}

  return {
    title: page.metadata.title || page.title,
    description: page.metadata?.description,
    openGraph: {
      title: page.metadata.openGraph.title || page.metadata.title || page.title,
      description: page.metadata.openGraph.description || page.metadata?.description,
      images: page.metadata?.openGraph.image
        ? [page.metadata?.openGraph.image.src]
        : undefined
    }
  }
}
