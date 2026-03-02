import { useEffect, useMemo, useState } from 'react'
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BadgePercent,
  Boxes,
  Factory,
  Handshake,
  Instagram,
  Leaf,
  MapPin,
  Megaphone,
  PackageCheck,
  PhoneCall,
  Sparkles,
  Store,
  TrendingUp,
  Video,
} from 'lucide-react'
import { SectionReveal } from './components/SectionReveal'
import { flavors, instagramImages } from './data/flavors'

const WHATSAPP_LINK =
  'https://wa.me/5511974884319?text=Olá!+Vi+a+Landing+Page+da+Caseirices+e+gostaria+de+receber+a+tabela+de+preços+para+revenda.'
const INSTAGRAM_LINK = 'https://www.instagram.com/caseiricesjundiai/'

const benefits = [
  {
    icon: BadgePercent,
    title: 'Margem de Lucro Alta',
    text: 'Posicionamento premium com precificacao forte para elevar rentabilidade por metro linear.',
  },
  {
    icon: TrendingUp,
    title: 'Giro Rapido de Estoque',
    text: 'Linha autoral com recompra recorrente e alta saida em supermercados e food service.',
  },
  {
    icon: Leaf,
    title: 'Qualidade 100% Natural',
    text: 'Receitas artesanais sem conservantes, com sabor caseiro premium e consistencia de lote.',
  },
  {
    icon: Handshake,
    title: 'Suporte Comercial Ativo',
    text: 'Atendimento proximo, materiais de venda e estrategia para acelerar entrada e sell-out.',
  },
]

const supportItems = [
  {
    icon: Store,
    title: 'Kit PDV de Conversao',
    text: 'Materiais de gondola e destaque para gerar decisao de compra no ponto de venda.',
  },
  {
    icon: Megaphone,
    title: 'Conteudo Pronto',
    text: 'Fotos e criativos prontos para campanhas locais e promocoes semanais.',
  },
  {
    icon: PackageCheck,
    title: 'Campanhas Conjuntas',
    text: 'Acoes coordenadas para ampliar giro, ticket medio e recorrencia.',
  },
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
    <div className="inline-flex items-center gap-3">
      <img
        src="/assets/brand/caseirices-emblem.svg"
        alt="Emblema da marca Caseirices"
        className="h-11 w-11 rounded-[14px] border border-brand-earth/20 bg-brand-cream p-1"
      />
      <div>
        <p className="font-display text-2xl leading-none text-brand-wine">Caseirices</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-earth/80">
          Molhos Artesanais
        </p>
      </div>
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
        const response = await fetch('/api/instagram-feed?username=caseiricesjundiai&limit=9', {
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

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-brand-cream text-brand-ink antialiased">
        <header className="sticky top-0 z-40 border-b border-brand-earth/20 bg-brand-cream shadow-[0_8px_24px_rgba(42,19,12,0.10)]">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
            <BrandLockup />
            <PrimaryButton href={WHATSAPP_LINK} className="hidden sm:inline-flex">
              Quero Revender
              <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
          </div>
        </header>

        <main className="pb-28">
          <SectionReveal className="relative overflow-hidden border-b border-brand-earth/14">
            <div className="absolute inset-0 bg-[linear-gradient(118deg,#7D0012_0%,#C8102E_34%,#D86A34_58%,#F6B24C_73%,#1F8B56_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(255,255,255,0.38),transparent_36%),radial-gradient(circle_at_84%_12%,rgba(255,255,255,0.32),transparent_35%),radial-gradient(circle_at_62%_88%,rgba(255,255,255,0.2),transparent_34%)]" />
            <div className="absolute -left-28 top-28 h-72 w-72 rounded-full bg-white/22 blur-[82px]" />
            <div className="absolute -right-24 top-12 h-64 w-64 rounded-full bg-[#C8102E]/34 blur-[68px]" />
            <div className="absolute inset-x-0 bottom-0 h-[22%] bg-brand-cream [clip-path:polygon(0_44%,100%_0,100%_100%,0_100%)]" />

            <div className="relative z-10 mx-auto grid h-[min(74vh,800px)] min-h-[600px] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-12">
              <div className="pb-8 lg:pb-24">
                <span className="inline-flex items-center gap-2 rounded-[999px] border border-white/40 bg-white/18 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-xl">
                  Parceria B2B em Jundiai-SP
                </span>

                <h1 className="mt-6 max-w-2xl text-balance font-display text-[2.6rem] leading-[0.92] text-[#23080F] drop-shadow-[0_1px_0_rgba(255,255,255,0.25)] sm:text-[3.6rem] lg:text-[5.05rem]">
                  Sabor artesanal premium para acelerar seu faturamento
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#2d120f]/84 sm:text-[1.1rem]">
                  Molhos 100% naturais, 16 sabores, margem alta e giro rapido. Nao ter Caseirices na
                  prateleira significa cliente insatisfeito e venda perdida.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <PrimaryButton href={WHATSAPP_LINK} className="w-full sm:w-auto">
                    Quero tabela de atacado e condicoes
                    <ArrowRight className="h-4 w-4" />
                  </PrimaryButton>
                  <SecondaryButton
                    href={INSTAGRAM_LINK}
                    className="w-full border-white/45 bg-white/28 text-[#23080F] hover:bg-white/38 sm:w-auto"
                  >
                    <Instagram className="h-4 w-4 text-brand-green" />
                    Ver Instagram da Marca
                  </SecondaryButton>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative mx-auto w-full max-w-[460px]">
                  <div className="absolute -left-6 top-9 h-28 w-28 rounded-[26px] border border-white/45 bg-white/26 p-4 shadow-[0_16px_42px_rgba(20,7,3,0.23)] backdrop-blur-xl">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2d120f]/70">SKU ativos</p>
                    <p className="mt-1 font-display text-4xl leading-none text-brand-wine">16</p>
                    <p className="mt-1 text-xs text-[#2d120f]/70">Giro semanal</p>
                  </div>

                  <div className="relative overflow-hidden rounded-[34px] border border-white/46 bg-white/24 p-6 shadow-[0_34px_66px_rgba(20,7,3,0.24)] backdrop-blur-2xl">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2d120f]/65">Painel comercial</p>
                      <span className="rounded-[999px] bg-brand-green/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-green">
                        Local Premium
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3">
                      {[
                        { label: 'Margem media', value: '42%', icon: <TrendingUp className="h-4 w-4 text-brand-green" /> },
                        { label: 'Sell-out em 30 dias', value: '3.4x', icon: <Boxes className="h-4 w-4 text-brand-green" /> },
                        {
                          label: 'Producao propria',
                          value: 'Desde 2017',
                          icon: <Factory className="h-4 w-4 text-brand-green" />,
                        },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[18px] border border-white/40 bg-white/35 p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-[#2d120f]/70">{item.label}</p>
                            {item.icon}
                          </div>
                          <p className="mt-2 font-display text-[2rem] leading-none text-brand-wine">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-[16px] border border-white/40 bg-[#23080f]/72 p-3">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-white/78">Mensagem central</p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        Sem Caseirices na gondola = cliente insatisfeito e venda perdida.
                      </p>
                    </div>
                  </div>

                  <div className="absolute -right-4 bottom-10 rounded-[16px] border border-white/42 bg-white/30 px-3 py-2 backdrop-blur-xl">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-[#2d120f]/70">Sem conservantes</p>
                    <p className="text-sm font-semibold text-brand-wine">100% natural</p>
                  </div>
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
                    Nao e catalogo comum: e uma linha pensada para girar rapido e valorizar sua
                    gondola com linguagem visual premium.
                  </p>
                </div>
                <span className="rounded-[10px] border border-brand-earth/20 bg-brand-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-earth">
                  Mix estrategico para revenda
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {flavors.map((item, index) => (
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
            </div>
          </SectionReveal>

          <SectionReveal className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-20">
            <article className="rounded-[26px] border border-brand-earth/16 bg-white/88 p-7 shadow-[0_16px_38px_rgba(55,27,16,0.1)] lg:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green">Por que Caseirices?</p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-brand-wine sm:text-4xl">
                Confiabilidade de fabrica local com padrao premium
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-ink/85 sm:text-base">
                Desde 2017, dois amigos transformaram receitas autorais em uma operacao solida com
                loja-fabrica propria em Jundiai.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Factory, title: 'Loja-fabrica', text: 'Producao propria e rastreavel' },
                  { icon: Boxes, title: 'Logistica agil', text: 'Reposicao com previsibilidade' },
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
                    label="Margem unitaria media"
                    min={4}
                    max={20}
                    step={1}
                    value={unitMargin}
                    onChange={setUnitMargin}
                    suffix=" R$"
                  />
                  <RangeControl
                    label="Valor do 1o pedido"
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
                Voce recebe estrutura comercial para vender mais desde a primeira semana.
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
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-3xl text-brand-wine sm:text-4xl">Instagram da Marca</h2>
                <p className="mt-2 text-sm text-brand-ink/80 sm:text-base">
                  Conteudo real da marca @caseiricesjundiai para fortalecer prova social no PDV.
                </p>
              </div>
              <SecondaryButton href={INSTAGRAM_LINK}>
                <Instagram className="h-4 w-4 text-brand-green" />
                @caseiricesjundiai
              </SecondaryButton>
            </div>

            <div className="mt-6 max-h-[800px] overflow-hidden rounded-[28px] border border-brand-earth/16 bg-white/90 p-3 shadow-[0_20px_50px_rgba(55,27,16,0.11)] sm:p-4">
              <div className="md:hidden">
                <div className="mx-auto max-w-md overflow-hidden rounded-[30px] border border-brand-earth/18 bg-white shadow-[0_20px_46px_rgba(44,21,13,0.16)]">
                  <div className="flex items-center justify-between border-b border-brand-earth/12 px-4 py-3">
                    <span className="text-sm font-semibold text-brand-ink">Instagram</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-green">
                      {instagramStatus === 'live' ? 'Ao vivo' : instagramStatus === 'loading' ? 'Carregando' : 'Feed local'}
                    </span>
                  </div>

                  <div className="flex gap-3 overflow-x-auto border-b border-brand-earth/12 px-4 py-3">
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
                            className="h-14 w-14 rounded-full border border-white object-cover"
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

                  <div className="max-h-[570px] overflow-y-auto p-3">
                    <div className="grid grid-cols-2 gap-3">
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
                          className="group relative aspect-square overflow-hidden rounded-[14px] border border-brand-earth/16 bg-brand-cream"
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

              <div className="hidden gap-4 md:grid md:grid-cols-[280px_1fr]">
                <aside className="rounded-[22px] border border-brand-earth/14 bg-brand-cream/70 p-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-[12px] border border-brand-earth/20 bg-white px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.11em] text-brand-earth">
                      @caseiricesjundiai
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-brand-ink/80">
                    {instagramStatus === 'live'
                      ? 'Feed sincronizado com as ultimas publicacoes da marca.'
                      : 'Instagram bloqueou a leitura publica; exibindo galeria local oficial para manter prova social ativa.'}
                  </p>
                  <a
                    href={INSTAGRAM_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-[12px] border border-brand-earth/18 bg-white px-3 py-2 text-sm font-semibold text-brand-wine transition hover:bg-brand-cream"
                  >
                    Abrir perfil oficial
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </aside>

                <div className="max-h-[735px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
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
                        className="group relative aspect-square overflow-hidden rounded-[18px] border border-brand-earth/16 bg-white"
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
          </SectionReveal>
        </main>

        <footer className="border-t border-brand-earth/20 bg-brand-wine px-4 py-8 text-brand-cream sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <BrandLockup />
              <p className="mt-4 text-sm leading-relaxed text-brand-cream/90">
                Rua Atilio Vianello, 409 - Vila Vianelo, Jundiai - SP, CEP 13207-130
              </p>
              <p className="mt-1 text-sm text-brand-cream/90">CNPJ: 28.150.452/0001-79</p>
            </div>
            <div className="flex flex-col gap-2 text-sm font-medium">
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
              <span className="inline-flex items-center gap-2 text-brand-cream/80">
                <MapPin className="h-4 w-4" /> Jundiai-SP
              </span>
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
                Quero tabela e condicoes
                <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}

export default App
