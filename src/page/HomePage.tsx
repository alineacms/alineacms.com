import styler from '@alinea/styler'
import type {Link as AnyLink} from 'alinea'
import {Query} from 'alinea'
import {Icon} from 'alinea/ui/Icon'
import {IcRoundInsertDriveFile} from 'alinea/ui/icons/IcRoundInsertDriveFile'
import {IcRoundOpenInNew} from 'alinea/ui/icons/IcRoundOpenInNew'
import {IcRoundPublish} from 'alinea/ui/icons/IcRoundPublish'
import {PhGlobe} from 'alinea/ui/icons/PhGlobe'
import {RiFlashlightFill} from 'alinea/ui/icons/RiFlashlightFill'
import {HStack, VStack} from 'alinea/ui/Stack'
import {px} from 'alinea/ui/util/Units'
import type {Metadata, MetadataRoute} from 'next'
import NextImage from 'next/image.js'
import type {ComponentType, PropsWithChildren, SVGProps} from 'react'
import heroBg from '@/assets/hero-alinea.jpg'
import programBadge from '@/assets/program-badge.svg'
import {cms} from '@/cms'
import {
  IcBaselineCloudQueue,
  IcBaselineDashboardCustomize,
  IcBaselineWorkspaces
} from '@/icons'
import {Feature, Features} from '@/layout/Features'
import {Hero} from '@/layout/Hero'
import {Link} from '@/layout/nav/Link'
import {PageContainer} from '@/layout/Page'
import WebLayout from '@/layout/WebLayout'
import {WebText} from '@/layout/WebText'
import {WebTypo} from '@/layout/WebTypo'
import {FeaturesBlockView} from '@/page/blocks/FeaturesBlockView'
import {ImageTextBlockView} from '@/page/blocks/ImageTextBlockView'
import {TemplateBlockView} from '@/page/blocks/TemplateBlock'
import {Home} from '@/schema/Home'
import {getMetadata} from '@/utils/metadata'
import {CodeTextBlockView} from './blocks/CodeTextBlockView'
import css from './HomePage.module.scss'

const styles = styler(css)

export async function generateMetadata(): Promise<Metadata> {
  const page = await cms.get({
    type: Home,
    select: {
      url: Query.url,
      title: Home.title,
      metadata: Home.metadata
    }
  })
  return await getMetadata(page)
}

interface HighlightProps {
  icon: ComponentType
  href: string
}
function Highlight({
  href,
  icon: Icon,
  children
}: PropsWithChildren<HighlightProps>) {
  return (
    <Link className={styles.highlight()} href={href}>
      <HStack gap={10}>
        <Icon />
        <span style={{lineHeight: 1}}>{children}</span>
      </HStack>
    </Link>
  )
}

function isUrlLink(link: AnyLink<{label: string}>) {
  return link._type === 'url'
}

type HomeHeroProps = {
  headline: string
  byline: string
  button?: AnyLink<{label: string}>
  link?: AnyLink<{label: string}>
}
function HomeHero({headline, byline, button, link}: HomeHeroProps) {
  return (
    <div className={styles.hero()}>
      <PageContainer>
        <div className={styles.hero.block()}>
          <NextImage
            priority
            fetchPriority="high"
            src={heroBg.src}
            placeholder="blur"
            blurDataURL={heroBg.blurDataURL}
            sizes="(max-width: 1440px) 100vw, 1280px"
            fill
            alt="Background"
            style={{objectFit: 'cover', zIndex: -1}}
          />
          <VStack center>
            <a
              href="https://vercel.com/oss"
              target="_blank"
              rel="noopener"
              className={styles.hero.vercel()}
            >
              <img alt="Vercel OSS Program" src={programBadge.src} />
            </a>
            {headline && <Hero.Title>{headline}</Hero.Title>}
            {byline && <Hero.ByLine>{byline}</Hero.ByLine>}
            {(button?.href || link?.href) && (
              <HStack
                wrap
                gap={`${px(16)} ${px(24)}`}
                center
                style={{paddingTop: px(20)}}
                justify="center"
              >
                {button?.href && (
                  <Hero.Action {...button}>
                    {button.fields.label || button.title}
                  </Hero.Action>
                )}
                {link?.href && (
                  <WebTypo.Link
                    href={link.href}
                    target={isUrlLink(link) ? link.target : undefined}
                    className={styles.hero.demo()}
                  >
                    <HStack gap={8} center>
                      <span>Try a demo</span>
                      {isUrlLink(link) && link.target === '_blank' && (
                        <Icon icon={IcRoundOpenInNew} />
                      )}
                    </HStack>
                  </WebTypo.Link>
                )}
              </HStack>
            )}
          </VStack>
        </div>
      </PageContainer>
    </div>
  )
}

export default async function HomePage() {
  const home = await cms.get({type: Home})

  return (
    <WebLayout>
      <main className={styles.home()}>
        <HomeHero {...home?.hero} />
        <PageContainer>
          <div className={styles.home.sections()}>
            <WebText
              doc={home.body}
              CodeTextBlock={CodeTextBlockView}
              FeaturesBlock={FeaturesBlockView}
              ImageTextBlock={ImageTextBlockView}
              TemplateBlock={TemplateBlockView}
            />

            <Features>
              <Feature>
                <WebTypo>
                  <Feature.Title icon={ProiconsOpenSource}>
                    Open source
                  </Feature.Title>
                  <WebTypo.P>
                    Open source by design, Alinea gives you full control over
                    your CMS. Use it, extend it, or contribute back.
                  </WebTypo.P>
                </WebTypo>
              </Feature>

              <Feature>
                <WebTypo>
                  <Feature.Title icon={RiFlashlightFill}>
                    Live Previews
                  </Feature.Title>
                  <WebTypo.P>
                    See exactly what content changes look like in real time.
                    Preview updates instantly with full support for React Server
                    Components.
                  </WebTypo.P>
                </WebTypo>
              </Feature>

              <Feature>
                <WebTypo>
                  <Feature.Title icon={IcBaselineDashboardCustomize}>
                    Custom Fields
                  </Feature.Title>
                  <WebTypo.P>
                    Extend Alinea with your own fields. Create custom inputs
                    with simple constructor functions. Tailored to exactly what
                    your editors need.
                  </WebTypo.P>
                </WebTypo>
              </Feature>
            </Features>
          </div>
        </PageContainer>

        {/*<PageContainer>
          <section className={styles.home.section()}>
            <div className={styles.home.demo()}>
              <iframe
                title="Alinea demo"
                src="https://alineacms.com/demo"
                className={styles.home.demo.inner()}
              />
            </div>
          </section>
        </PageContainer>*/}

        <PageContainer>
          <HStack justify="space-evenly" gap={`${px(16)} ${px(30)}`} wrap>
            <Highlight
              href="/docs/content/live-previews"
              icon={RiFlashlightFill}
            >
              Live previews
            </Highlight>

            <Highlight
              icon={IcRoundPublish}
              href="/blog/alinea-0-4-0#content-workflow"
            >
              Editorial workflow
            </Highlight>

            <Highlight icon={IcRoundInsertDriveFile} href="/docs/content/query">
              Query engine
            </Highlight>

            <Highlight
              icon={IcBaselineDashboardCustomize}
              href="/docs/configuration/fields/custom-fields"
            >
              Custom fields
            </Highlight>

            <Highlight
              icon={IcBaselineWorkspaces}
              href="/docs/configuration/workspaces"
            >
              Workspaces
            </Highlight>

            <Highlight
              icon={PhGlobe}
              href="/docs/reference/internationalization"
            >
              Internationalization
            </Highlight>

            <Highlight icon={IcBaselineCloudQueue} href="/docs/deploy">
              Self-host or cloud host
            </Highlight>
          </HStack>
        </PageContainer>
      </main>
    </WebLayout>
  )
}

HomePage.sitemap = (): MetadataRoute.Sitemap => {
  return [{url: '/', priority: 1}]
}

export function ProiconsOpenSource(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      {/* Icon from ProIcons by ProCode - https://github.com/ProCode-Software/proicons/blob/main/LICENSE */}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15.157 20.136c.211.51.8.757 1.284.492a9.25 9.25 0 1 0-8.882 0c.484.265 1.073.018 1.284-.492l1.358-3.28c.212-.51-.043-1.086-.478-1.426a3.7 3.7 0 1 1 4.554 0c-.435.34-.69.916-.478 1.426z"
      />
    </svg>
  )
}
