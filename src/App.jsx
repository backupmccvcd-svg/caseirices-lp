import { useEffect, useMemo, useState } from 'react'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BadgePercent,
  BusFront,
  Car,
  Clock3,
  Boxes,
  ExternalLink,
  Factory,
  Globe,
  Handshake,
  Instagram,
  Leaf,
  MapPin,
  Megaphone,
  Navigation,
  PackageCheck,
  PhoneCall,
  Share2,
  Sparkles,
  Star,
  Store,
  TrendingUp,
  Video,
} from 'lucide-react'
import { SectionReveal } from './components/SectionReveal'
import { flavors, instagramImages } from './data/flavors'

const WHATSAPP_LINK =
  'https://wa.me/5511974884319?text=Olá!+Vi+a+Landing+Page+da+Caseirices+e+gostaria+de+receber+a+tabela+de+preços+para+revenda.'
const WHATSAPP_FLOAT_LINK =
  'https://api.whatsapp.com/send?phone=5511974884319&text=Eu%20gostaria%20de%20ter%20produtos%20caseirices%20em%20meu%20ponto%20comercial'
const INSTAGRAM_LINK = 'https://www.instagram.com/caseiricesjundiai/'

const benefits = [
  {
    icon: BadgePercent,
    title: 'Margem de Lucro Alta',
    text: 'Posicionamento premium com precificação forte para elevar rentabilidade por metro linear.',
  },
  {
    icon: TrendingUp,
    title: 'Giro Rápido de Estoque',
    text: 'Linha autoral com recompra recorrente e alta saída em supermercados e food service.',
  },
  {
    icon: Leaf,
    title: 'Qualidade 100% Natural',
    text: 'Receitas artesanais sem conservantes, com sabor caseiro premium e consistência de lote.',
  },
  {
    icon: Handshake,
    title: 'Suporte Comercial Ativo',
    text: 'Atendimento próximo, materiais de venda e estratégia para acelerar entrada e sell-out.',
  },
]

const supportItems = [
  {
    icon: Store,
    title: 'Kit PDV de Conversão',
    text: 'Materiais de gôndola e destaque para gerar decisão de compra no ponto de venda.',
  },
  {
    icon: Megaphone,
    title: 'Conteúdo Pronto',
    text: 'Fotos e criativos prontos para campanhas locais e promoções semanais.',
  },
  {
    icon: PackageCheck,
    title: 'Campanhas Conjuntas',
    text: 'Ações coordenadas para ampliar giro, ticket médio e recorrência.',
  },
]

const placeholderTestimonials = [
  {
    business: 'Empório Serra Verde - Jundiaí',
    quote:
      'A linha Caseirices entrou no mix e em 30 dias virou item de recompra. Giro muito acima do esperado para molho premium.',
    person: 'Compras e Curadoria',
  },
  {
    business: 'Rede Mercado Bom Dia - Região',
    quote:
      'Produto com excelente aceitação no ponto de venda e margem saudável. O suporte comercial ajudou no sell-out desde a primeira semana.',
    person: 'Gerente Comercial',
  },
  {
    business: 'Hotel Fazenda Santa Clara',
    quote:
      'Padrão de sabor consistente e proposta artesanal real. Hoje faz parte fixa do nosso café e do menu executivo.',
    person: 'Chef Responsável',
  },
]

const flavorFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'classicos', label: 'Clássicos' },
  { id: 'premium', label: 'Premium' },
  { id: 'picantes', label: 'Picantes' },
]

function formatMoney(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0)
}

function BrandLockup() {
  return (
    <div className="inline-flex items-center">
      <img
        src="/assets/brand/caseirices-logo.png"
        alt="Logo da marca Caseirices"
        className="h-14 w-auto sm:h-16"
      />
    </div>
  )
}

function PrimaryButton({ href, children, className = '' }) {
  const shouldReduceMotion = useReducedMotion()
  return (
    <m.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
      className={`inline-flex items-center justify-center gap-2 rounded-[14px] border border-brand-red-dark bg-brand-red px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white shadow-[0_16px_36px_rgba(139,0,0,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-red-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cream focus-visible:ring-offset-2 focus-visible:ring-offset-brand-red ${className}`}
    >
      {children}
    </m.a>
  )
}

function SecondaryButton({ href, children, dark = false, className = '' }) {
  const shouldReduceMotion = useReducedMotion()
  const base = dark
    ? 'border-white/35 bg-white/12 text-white hover:bg-white/20 focus-visible:ring-white/80 focus-visible:ring-offset-[#2A130C]'
    : 'border-brand-earth/20 bg-white/85 text-brand-ink hover:bg-white focus-visible:ring-brand-wine/55 focus-visible:ring-offset-brand-cream'

  return (
    <m.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
      className={`inline-flex items-center justify-center gap-2 rounded-[14px] border px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${base} ${className}`}
    >
      {children}
    </m.a>
  )
}

function RangeControl({ label, value, onChange, min, max, step, suffix = '' }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-brand-cream/92">
        <span>{label}</span>
        <span className="font-semibold text-brand-cream">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="range-premium h-2 w-full cursor-pointer appearance-none rounded-full bg-brand-cream/20"
      />
    </label>
  )
}

function App() {
  const shouldReduceMotion = useReducedMotion()
  const MotionArticle = m.article
  const [boxesPerWeek, setBoxesPerWeek] = useState(12)
  const [unitMargin, setUnitMargin] = useState(8)
  const [firstOrder, setFirstOrder] = useState(3200)
  const [activeFlavorFilter, setActiveFlavorFilter] = useState('all')
  const [showAllFlavors, setShowAllFlavors] = useState(false)
  const [instagramFeed, setInstagramFeed] = useState(
    instagramImages.map((image, index) => ({
      id: `fallback-${index}`,
      image,
      permalink: INSTAGRAM_LINK,
      isVideo: false,
      source: 'fallback',
    })),
  )
  const [instagramStatus, setInstagramStatus] = useState('loading')

  useEffect(() => {
    let active = true

    async function loadFeed() {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4800)

      try {
        const response = await fetch('/api/instagram-feed?username=caseiricesjundiai&limit=12', {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error('feed-offline')
        const data = await response.json()
        if (!active || !data?.ok || !Array.isArray(data.items) || data.items.length === 0) {
          throw new Error('empty-feed')
        }
        setInstagramFeed(
          data.items.map((item, index) => ({
            ...item,
            id: item.id ?? `live-${index}`,
            source: 'live',
          })),
        )
        setInstagramStatus('live')
      } catch {
        if (!active) return
        setInstagramStatus('fallback')
        setInstagramFeed(
          instagramImages.map((image, index) => ({
            id: `fallback-${index}`,
            image,
            permalink: INSTAGRAM_LINK,
            isVideo: false,
            source: 'fallback',
          })),
        )
      } finally {
        clearTimeout(timeoutId)
      }
    }

    loadFeed()
    return () => {
      active = false
    }
  }, [])

  const metrics = useMemo(() => {
    const unitsPerBox = 12
    const monthlyProfit = boxesPerWeek * unitsPerBox * unitMargin * 4.33
    const paybackMonths = firstOrder > 0 ? firstOrder / monthlyProfit : 0
    const annualRoi = firstOrder > 0 ? ((monthlyProfit * 12 - firstOrder) / firstOrder) * 100 : 0

    return { monthlyProfit, paybackMonths, annualRoi }
  }, [boxesPerWeek, unitMargin, firstOrder])

  const filteredFlavors = useMemo(() => {
    if (activeFlavorFilter === 'all') return flavors
    return flavors.filter((item) => item.group === activeFlavorFilter)
  }, [activeFlavorFilter])

  const visibleFlavors = useMemo(() => {
    return showAllFlavors ? filteredFlavors : filteredFlavors.slice(0, 8)
  }, [filteredFlavors, showAllFlavors])

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen overflow-x-clip bg-brand-cream text-brand-ink antialiased">
        <main className="pb-28">
          <SectionReveal className="relative overflow-hidden border-b border-brand-earth/14">
            <div className="absolute inset-0">
              <video
                className="h-full w-full scale-110 object-cover blur-[4px] saturate-[1.12] brightness-[0.5]"
                autoPlay={!shouldReduceMotion}
                muted
                loop
                playsInline
                poster="/assets/hero/fundador-caseirices.jpg"
                aria-hidden="true"
              >
                <source src="/assets/hero/hero-farmer.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(200,16,46,0.28),transparent_36%),radial-gradient(circle_at_84%_8%,rgba(34,139,34,0.22),transparent_34%),linear-gradient(to_bottom,rgba(22,10,8,0.54),rgba(22,10,8,0.78))]" />
            </div>

            <div className="relative z-10 mx-auto flex h-[min(78vh,800px)] min-h-[620px] max-w-7xl items-center justify-center px-4 py-9 sm:px-6 lg:px-10 lg:py-12">
              <div className="w-full max-w-4xl text-center text-white">
                <m.img
                  initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.55 }}
                  src="/assets/brand/caseirices-logo-hero.png"
                  alt="Logo Caseirices sem fundo"
                  className="mx-auto h-28 w-auto drop-shadow-[0_10px_22px_rgba(0,0,0,0.45)] sm:h-32 lg:h-36"
                />

                <m.span
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.45, delay: 0.08 }}
                  className="mt-5 inline-flex items-center justify-center rounded-[999px] border border-white/38 bg-black/28 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
                >
                  O verdadeiro molho de tomate caseiro
                </m.span>

                <m.h1
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.5, delay: 0.16 }}
                  className="mx-auto mt-5 max-w-3xl text-balance font-display text-4xl leading-[0.95] text-white sm:text-5xl lg:text-[4.2rem]"
                >
                  Leve o sabor artesanal autêntico de Jundiaí para sua prateleira
                </m.h1>

                <m.p
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.45, delay: 0.24 }}
                  className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-white/90 sm:text-lg"
                >
                  Molhos 100% naturais, 16 sabores, margem premium e giro garantido. Não ter
                  Caseirices na prateleira = cliente insatisfeito e venda perdida.
                </m.p>

                <m.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.45, delay: 0.3 }}
                  className="mt-7 flex flex-wrap justify-center gap-3"
                >
                  <PrimaryButton href={WHATSAPP_LINK} className="w-full sm:w-auto">
                    Quero tabela de atacado e condições
                    <ArrowRight className="h-4 w-4" />
                  </PrimaryButton>
                  <SecondaryButton href={INSTAGRAM_LINK} dark className="w-full sm:w-auto">
                    <Instagram className="h-4 w-4 text-brand-green" />
                    Ver Instagram da Marca
                  </SecondaryButton>
                </m.div>

                <m.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? undefined : { duration: 0.45, delay: 0.38 }}
                  className="mt-6 flex justify-center"
                >
                  <a
                    href="#quem-somos"
                    className="inline-flex items-center gap-2 rounded-[999px] border border-white/28 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/78 backdrop-blur-md transition hover:bg-white/14 hover:text-white"
                    aria-label="Rolar para seção Quem Somos"
                  >
                    <m.span
                      animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
                      transition={shouldReduceMotion ? undefined : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative inline-flex h-4 w-4 items-center justify-center"
                    >
                      <span className="h-3 w-3 rounded-full bg-brand-red/85 shadow-[inset_0_-1px_0_rgba(0,0,0,0.2)]" />
                      <span className="absolute -top-0.5 h-1 w-1.5 rounded-b-full rounded-t-[2px] bg-brand-green/85" />
                    </m.span>
                    Deslize
                  </a>
                </m.div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal id="quem-somos" className="mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-10 lg:pb-20">
            <div className="grid gap-5 rounded-[24px] border border-brand-earth/16 bg-white/88 p-5 shadow-[0_18px_38px_rgba(55,27,16,0.10)] md:grid-cols-[0.95fr_1.05fr] sm:p-7">
              <div className="overflow-hidden rounded-[18px] border border-brand-earth/14">
                <img
                  src="/assets/hero/fundador-caseirices.jpg"
                  alt="Fundador da Caseirices ao lado da linha de molhos"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green">Quem Somos Nós</p>
                <h2 className="mt-3 font-display text-3xl leading-tight text-brand-wine sm:text-4xl">
                  Produção própria em Jundiaí com sabor caseiro de verdade
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-ink/85 sm:text-base">
                  A Caseirices nasceu da amizade de dois apaixonados por gastronomia artesanal. Desde
                  2017, nossa missão é levar para mercados, empórios e restaurantes um molho com sabor
                  autêntico, qualidade constante e proposta comercial que gira rápido na prateleira.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink/85 sm:text-base">
                  Hoje operamos com loja de fábrica em Jundiaí, produção própria sem conservantes e
                  suporte ativo para revendedores que querem margem alta com produto premium local.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {['Desde 2017', 'Produção própria', 'Sem conservantes', 'Parceria B2B local'].map((item) => (
                    <span
                      key={item}
                      className="rounded-[10px] border border-brand-earth/18 bg-brand-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-earth"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((item) => {
                const Icon = item.icon
                return (
                  <article
                    key={item.title}
                    className="group relative rounded-[24px] border border-brand-earth/16 bg-white/88 p-6 shadow-[0_14px_36px_rgba(55,27,16,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(55,27,16,0.12)]"
                  >
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-green/10 blur-2xl transition group-hover:bg-brand-red/10" />
                    <Icon className="relative h-6 w-6 text-brand-green" />
                    <h3 className="relative mt-4 font-display text-2xl leading-tight text-brand-wine">{item.title}</h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-brand-ink/82">{item.text}</p>
                  </article>
                )
              })}
            </div>
          </SectionReveal>

          <SectionReveal className="border-y border-brand-earth/14 bg-white/62 py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-brand-wine sm:text-4xl">Vitrine de Produtos</h2>
                  <p className="mt-2 max-w-2xl text-sm text-brand-ink/82 sm:text-base">
                    Não é catálogo comum: é uma linha pensada para girar rápido e valorizar sua
                    gôndola com linguagem visual premium.
                  </p>
                </div>
                <span className="rounded-[10px] border border-brand-earth/20 bg-brand-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-earth">
                  Mix estratégico para revenda
                </span>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                {flavorFilters.map((filter) => {
                  const active = activeFlavorFilter === filter.id
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => {
                        setActiveFlavorFilter(filter.id)
                        setShowAllFlavors(false)
                      }}
                      className={`rounded-[10px] border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                        active
                          ? 'border-brand-red-dark bg-brand-red text-white shadow-[0_8px_20px_rgba(139,0,0,0.24)]'
                          : 'border-brand-earth/20 bg-white text-brand-earth hover:bg-brand-cream'
                      }`}
                    >
                      {filter.label}
                    </button>
                  )
                })}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {visibleFlavors.map((item, index) => (
                  <MotionArticle
                    key={item.name}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.12 }}
                    transition={shouldReduceMotion ? undefined : { duration: 0.38, delay: index * 0.02 }}
                    whileHover={shouldReduceMotion ? undefined : { y: -5 }}
                    className="group overflow-hidden rounded-[22px] border border-brand-earth/16 bg-white shadow-[0_10px_28px_rgba(49,24,12,0.09)]"
                  >
                    <div className="relative aspect-square overflow-hidden bg-brand-cream">
                      <img
                        src={item.image}
                        alt={`Frasco do sabor ${item.name}`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(event) => {
                          if (item.fallbackImage) {
                            event.currentTarget.onerror = null
                            event.currentTarget.src = item.fallbackImage
                            event.currentTarget.className =
                              'h-full w-full object-contain p-5 transition duration-500 group-hover:scale-105'
                          }
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
                      <p className="absolute bottom-3 left-3 right-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90">
                        Giro e margem premium
                      </p>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-brand-wine sm:text-base">{item.name}</h3>
                      <p className="mt-1 text-xs text-brand-ink/75 sm:text-sm">{item.profile}</p>
                    </div>
                  </MotionArticle>
                ))}
              </div>

              {filteredFlavors.length > 8 ? (
                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllFlavors((current) => !current)}
                    className="rounded-[12px] border border-brand-earth/18 bg-white px-4 py-2 text-sm font-semibold text-brand-wine transition hover:bg-brand-cream"
                  >
                    {showAllFlavors ? 'Mostrar menos' : `Ver mais ${filteredFlavors.length - 8} sabores`}
                  </button>
                </div>
              ) : null}
            </div>
          </SectionReveal>

          <SectionReveal className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-20">
            <article className="rounded-[26px] border border-brand-earth/16 bg-white/88 p-7 shadow-[0_16px_38px_rgba(55,27,16,0.1)] lg:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green">Por que Caseirices?</p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-brand-wine sm:text-4xl">
                Confiabilidade de fábrica local com padrão premium
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-ink/85 sm:text-base">
                Desde 2017, dois amigos transformaram receitas autorais em uma operação sólida com
                loja-fábrica própria em Jundiaí.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Factory, title: 'Loja-fábrica', text: 'Produção própria e rastreável' },
                  { icon: Boxes, title: 'Logística ágil', text: 'Reposição com previsibilidade' },
                  { icon: Handshake, title: 'Suporte ativo', text: 'Apoio real ao sell-out' },
                  { icon: BadgePercent, title: 'Margem premium', text: 'Posicionamento de valor' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="rounded-[14px] border border-brand-earth/14 bg-brand-cream/75 p-3">
                      <Icon className="h-4 w-4 text-brand-green" />
                      <p className="mt-2 text-sm font-bold text-brand-wine">{item.title}</p>
                      <p className="mt-1 text-xs text-brand-ink/80">{item.text}</p>
                    </div>
                  )
                })}
              </div>
            </article>

            <article className="relative overflow-hidden rounded-[26px] border border-brand-earth/20 bg-brand-wine p-7 text-brand-cream shadow-[0_20px_46px_rgba(55,27,16,0.3)] lg:p-9">
              <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-brand-red/35 blur-2xl" />
              <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-brand-green/22 blur-2xl" />
              <div className="relative">
                <h2 className="font-display text-3xl sm:text-4xl">Simulador de Retorno</h2>
                <p className="mt-2 text-sm text-brand-cream/88 sm:text-base">
                  Estime lucro mensal, payback e ROI com base no seu volume de compra.
                </p>

                <div className="mt-7 space-y-5">
                  <RangeControl
                    label="Caixas por semana"
                    min={4}
                    max={60}
                    step={1}
                    value={boxesPerWeek}
                    onChange={setBoxesPerWeek}
                  />
                  <RangeControl
                    label="Margem unitária média"
                    min={4}
                    max={20}
                    step={1}
                    value={unitMargin}
                    onChange={setUnitMargin}
                    suffix=" R$"
                  />
                  <RangeControl
                    label="Valor do 1º pedido"
                    min={1200}
                    max={14000}
                    step={200}
                    value={firstOrder}
                    onChange={setFirstOrder}
                    suffix=" R$"
                  />
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[14px] border border-brand-cream/38 bg-[#2d0808]/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-brand-cream/85">Lucro mensal</p>
                    <p className="mt-1 font-display text-2xl text-brand-cream">{formatMoney(metrics.monthlyProfit)}</p>
                    <div className="mt-2 h-[2px] w-10 rounded-full bg-brand-green/80" />
                  </div>
                  <div className="rounded-[14px] border border-brand-cream/38 bg-[#2d0808]/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-brand-cream/85">Payback</p>
                    <p className="mt-1 font-display text-2xl text-brand-cream">{metrics.paybackMonths.toFixed(1)} meses</p>
                    <div className="mt-2 h-[2px] w-10 rounded-full bg-brand-green/80" />
                  </div>
                  <div className="rounded-[14px] border border-brand-cream/38 bg-[#2d0808]/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-brand-cream/85">ROI anual</p>
                    <p className="mt-1 font-display text-2xl text-brand-cream">{metrics.annualRoi.toFixed(0)}%</p>
                    <div className="mt-2 h-[2px] w-10 rounded-full bg-brand-green/80" />
                  </div>
                </div>
              </div>
            </article>
          </SectionReveal>

          <SectionReveal className="border-y border-brand-earth/14 bg-white/65 py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
              <h2 className="font-display text-3xl text-brand-wine sm:text-4xl">Materiais de Apoio para Revendedores</h2>
              <p className="mt-2 max-w-3xl text-sm text-brand-ink/82 sm:text-base">
                Você recebe estrutura comercial para vender mais desde a primeira semana.
              </p>
              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {supportItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <article
                      key={item.title}
                      className="rounded-[22px] border border-brand-earth/16 bg-white p-5 shadow-[0_12px_28px_rgba(55,27,16,0.08)]"
                    >
                      <Icon className="h-6 w-6 text-brand-green" />
                      <h3 className="mt-4 font-display text-2xl leading-tight text-brand-wine">{item.title}</h3>
                      <p className="mt-2 text-sm text-brand-ink/85">{item.text}</p>
                    </article>
                  )
                })}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
            <div className="rounded-[24px] border border-brand-earth/16 bg-white/88 p-5 shadow-[0_16px_34px_rgba(55,27,16,0.09)] sm:p-7">
              <h2 className="font-display text-3xl text-brand-wine sm:text-4xl">
                Mercados e empórios que confiam em nosso produto
              </h2>
              <p className="mt-2 text-sm text-brand-ink/82 sm:text-base">
                Secao pronta para prova social. Abaixo estao depoimentos temporarios enquanto recebemos os reais.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {placeholderTestimonials.map((item) => (
                  <article
                    key={item.business}
                    className="rounded-[18px] border border-brand-earth/14 bg-brand-cream/55 p-4"
                  >
                    <p className="text-sm leading-relaxed text-brand-ink/88">"{item.quote}"</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-brand-wine">
                      {item.person}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-brand-earth">{item.business}</p>
                  </article>
                ))}
              </div>

              <div className="mt-5 rounded-[14px] border border-dashed border-brand-red/35 bg-brand-red/5 px-4 py-3">
                <p className="text-sm font-semibold text-brand-wine">
                  Enviar 3 depoimentos reais:
                </p>
                <p className="mt-1 text-sm text-brand-ink/85">
                  Me mande 3 falas curtas (nome do estabelecimento + cargo) para substituir estes
                  depoimentos provisórios e publicar a versão final.
                </p>
              </div>
            </div>
          </SectionReveal>

          <SectionReveal className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
            <div className="max-h-[800px] overflow-hidden rounded-[24px] border border-brand-earth/14 bg-white/55 p-4 sm:p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl text-brand-wine sm:text-4xl">Instagram da Marca</h2>
                <p className="mt-2 text-sm text-brand-ink/80 sm:text-base">
                  Conteúdo real da marca @caseiricesjundiai para fortalecer prova social no PDV.
                </p>
              </div>
              <SecondaryButton href={INSTAGRAM_LINK}>
                <Instagram className="h-4 w-4 text-brand-green" />
                @caseiricesjundiai
              </SecondaryButton>
              </div>

            <div className="mt-4 max-h-[680px] overflow-hidden rounded-[22px] border border-brand-earth/16 bg-white/90 p-2.5 shadow-[0_16px_38px_rgba(55,27,16,0.09)] sm:p-3">
              <div className="md:hidden">
                <div className="mx-auto max-w-md overflow-hidden rounded-[24px] border border-brand-earth/16 bg-white shadow-[0_16px_36px_rgba(44,21,13,0.14)]">
                  <div className="flex items-center justify-between border-b border-brand-earth/12 px-3 py-2.5">
                    <span className="text-sm font-semibold text-brand-ink">Instagram</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-green">
                      {instagramStatus === 'live' ? 'Ao vivo' : instagramStatus === 'loading' ? 'Carregando' : 'Feed local'}
                    </span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto border-b border-brand-earth/12 px-3 py-2.5">
                    {instagramFeed.slice(0, 8).map((item, index) => (
                      <a
                        key={`story-${item.id}`}
                        href={item.permalink}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0"
                        aria-label={`Story ${index + 1}`}
                      >
                        <span className="block rounded-full bg-[linear-gradient(160deg,#C8102E,#E35F3C,#228B22)] p-[2px]">
                          <img
                            src={item.image}
                            alt=""
                            className="h-11 w-11 rounded-full border border-white object-cover"
                            onError={(event) => {
                              const fallbackImage = instagramImages[index % instagramImages.length]
                              if (!event.currentTarget.src.endsWith(fallbackImage)) {
                                event.currentTarget.src = fallbackImage
                              }
                            }}
                          />
                        </span>
                      </a>
                    ))}
                  </div>

                  <div className="max-h-[500px] overflow-y-auto p-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      {instagramFeed.map((item, index) => (
                        <m.a
                          key={`mobile-${item.id}`}
                          href={item.permalink}
                          target="_blank"
                          rel="noreferrer"
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={shouldReduceMotion ? undefined : { duration: 0.3, delay: index * 0.03 }}
                          className="group relative aspect-square overflow-hidden rounded-[12px] border border-brand-earth/14 bg-brand-cream"
                        >
                          <img
                            src={item.image}
                            alt={`Publicacao ${index + 1} do Instagram da Caseirices`}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            onError={(event) => {
                              const fallbackImage = instagramImages[index % instagramImages.length]
                              if (!event.currentTarget.src.endsWith(fallbackImage)) {
                                event.currentTarget.src = fallbackImage
                              }
                            }}
                          />
                          {item.isVideo ? (
                            <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-[8px] border border-white/40 bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                              <Video className="h-3 w-3" /> Video
                            </span>
                          ) : null}
                        </m.a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden gap-3 md:grid md:grid-cols-[230px_1fr]">
                <aside className="rounded-[18px] border border-brand-earth/14 bg-brand-cream/70 p-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-[12px] border border-brand-earth/20 bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-brand-earth">
                      @caseiricesjundiai
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-brand-ink/80">
                    {instagramStatus === 'live'
                      ? 'Feed sincronizado com as últimas publicações da marca.'
                      : 'Instagram bloqueou a leitura pública; exibindo galeria local oficial para manter prova social ativa.'}
                  </p>
                  <a
                    href={INSTAGRAM_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-[10px] border border-brand-earth/18 bg-white px-3 py-2 text-sm font-semibold text-brand-wine transition hover:bg-brand-cream"
                  >
                    Abrir perfil oficial
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </aside>

                <div className="max-h-[610px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-3 gap-2 lg:grid-cols-4">
                    {instagramFeed.map((item, index) => (
                      <m.a
                        key={item.id}
                        href={item.permalink}
                        target="_blank"
                        rel="noreferrer"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                        whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={shouldReduceMotion ? undefined : { duration: 0.35, delay: index * 0.04 }}
                        className="group relative aspect-square overflow-hidden rounded-[12px] border border-brand-earth/14 bg-white"
                      >
                        <img
                          src={item.image}
                          alt={`Publicacao ${index + 1} do Instagram da Caseirices`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(event) => {
                            const fallbackImage = instagramImages[index % instagramImages.length]
                            if (!event.currentTarget.src.endsWith(fallbackImage)) {
                              event.currentTarget.src = fallbackImage
                            }
                          }}
                        />
                        {item.isVideo ? (
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-[8px] border border-white/40 bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                            <Video className="h-3 w-3" /> Video
                          </span>
                        ) : null}
                      </m.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </SectionReveal>
        </main>

        <footer className="border-t border-brand-earth/20 bg-brand-wine px-4 py-8 text-brand-cream sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[22px] border border-white/20 bg-[#5a0a0a]/55 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.22)] sm:p-7">
              <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <BrandLockup />
                  <h3 className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl">
                    Caseirices Molhos Artesanais - Loja de Fábrica e Empório Artesanal
                  </h3>
                  <p className="mt-2 text-sm text-brand-cream/88 sm:text-base">Jundiaí - SP</p>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-[12px] border border-white/25 bg-white/10 px-3 py-2">
                    <span className="inline-flex items-center gap-1 text-[#F8D66D]">
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                      <Star className="h-4 w-4 fill-current" />
                    </span>
                    <span className="text-sm font-semibold text-white">5,0</span>
                    <span className="text-sm text-brand-cream/90">4 avaliações no Google</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href="https://caseirices.com.br"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-[12px] border border-white/24 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/18"
                    >
                      <Globe className="h-4 w-4" />
                      Site
                    </a>
                    <a
                      href="https://maps.google.com/?q=Rua+Atílio+Vianello,+409,+Jundiaí+-+SP,+13207-130"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-[12px] border border-white/24 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/18"
                    >
                      <Navigation className="h-4 w-4" />
                      Rotas
                    </a>
                    <a
                      href="tel:+5511974884319"
                      className="inline-flex items-center gap-2 rounded-[12px] border border-white/24 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/18"
                    >
                      <PhoneCall className="h-4 w-4" />
                      Ligar
                    </a>
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-[12px] border border-white/24 bg-white/10 px-3 py-2 text-sm font-medium transition hover:bg-white/18"
                    >
                      <Share2 className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="rounded-[16px] border border-white/18 bg-black/20 p-4 sm:p-5">
                  <ul className="space-y-3 text-sm sm:text-base">
                    <li className="inline-flex w-full items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      <span>Rua Atílio Vianello, 409 - Vila Vianelo, Jundiaí - SP, CEP 13207-130</span>
                    </li>
                    <li className="inline-flex w-full items-start gap-2">
                      <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      <span>(11) 97488-4319</span>
                    </li>
                    <li className="inline-flex w-full items-start gap-2">
                      <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      <span>Horário de funcionamento: Aberto - Fecha 16:45</span>
                    </li>
                    <li className="inline-flex w-full items-start gap-2">
                      <BusFront className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      <span>Chegue em: 34 min (ônibus)</span>
                    </li>
                    <li className="inline-flex w-full items-start gap-2">
                      <Car className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      <span>Chegue em: 18 min (carro)</span>
                    </li>
                    <li className="inline-flex w-full items-start gap-2">
                      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                      <span>CNPJ: 28.150.452/0001-79</span>
                    </li>
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
                    <a
                      href={INSTAGRAM_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 transition hover:text-brand-green"
                    >
                      <Instagram className="h-4 w-4" /> Instagram oficial
                    </a>
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 transition hover:text-brand-green"
                    >
                      <PhoneCall className="h-4 w-4" /> WhatsApp comercial
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="pointer-events-auto mx-auto w-full rounded-[16px] border border-brand-red-dark bg-brand-red px-3 py-3 shadow-[0_18px_40px_rgba(139,0,0,0.38)] lg:ml-auto lg:mr-0 lg:max-w-md">
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                Parceria comercial premium
              </p>
              <PrimaryButton href={WHATSAPP_LINK} className="mt-2 w-full rounded-[12px] border-white/35 bg-brand-red-dark hover:bg-[#6c1010] focus-visible:ring-offset-brand-red">
                Quero tabela e condições
                <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>
          </div>
        </div>

        <a
          href={WHATSAPP_FLOAT_LINK}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp fixo Caseirices"
          className="fixed left-3 top-1/2 z-50 -translate-y-1/2 rounded-full border border-white/40 bg-[#25D366] p-3 text-white shadow-[0_16px_34px_rgba(12,74,36,0.38)] transition hover:scale-[1.05] hover:bg-[#1eb95a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#25D366]"
        >
          <PhoneCall className="h-5 w-5" />
        </a>
      </div>
    </LazyMotion>
  )
}

export default App
