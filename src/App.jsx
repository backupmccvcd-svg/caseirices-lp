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
    text: 'Posicionamento premium com precificacao forte para aumentar rentabilidade por metro linear.',
  },
  {
    icon: TrendingUp,
    title: 'Giro Rapido de Estoque',
    text: 'Linha autoral com recompra recorrente e alta saida em supermercados, emporios e food service.',
  },
  {
    icon: Leaf,
    title: 'Qualidade 100% Natural',
    text: 'Receitas artesanais sem conservantes, com sabor caseiro premium e consistencia de lote.',
  },
  {
    icon: Handshake,
    title: 'Producao em Jundiai + Suporte',
    text: 'Atendimento proximo, materiais de venda e estrategia para acelerar entrada e sell-out.',
  },
]

const supportItems = [
  {
    icon: Store,
    title: 'Kit PDV de Conversao',
    text: 'Etiquetas, materiais de gôndola e visuais para aumentar destaque no ponto de venda.',
  },
  {
    icon: Megaphone,
    title: 'Conteudo Pronto para Redes',
    text: 'Fotos profissionais e criativos prontos para campanhas locais e ofertas semanais.',
  },
  {
    icon: PackageCheck,
    title: 'Campanhas Conjuntas',
    text: 'Acoes comerciais coordenadas para gerar trafego, degustacao e recompra.',
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
      <div className="relative">
        <div className="absolute inset-0 bg-brand-red/25 blur-lg" />
        <img
          src="/assets/brand/caseirices-emblem.svg"
          alt="Emblema da marca Caseirices"
          className="relative h-12 w-12 border border-brand-earth/20 bg-brand-cream p-1"
        />
      </div>
      <div>
        <p className="font-display text-2xl leading-none text-brand-wine">Caseirices</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-earth/80">
          Molhos Artesanais
        </p>
      </div>
    </div>
  )
}

function RangeControl({ label, value, onChange, min, max, step, suffix = '' }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-sm font-medium text-brand-cream/90">
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
        className="range-premium h-2 w-full cursor-pointer appearance-none bg-brand-cream/20"
      />
    </label>
  )
}

function App() {
  const shouldReduceMotion = useReducedMotion()
  const MotionAnchor = m.a
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
    })),
  )

  useEffect(() => {
    let isMounted = true

    async function loadInstagramFeed() {
      try {
        const response = await fetch('/api/instagram-feed?username=caseiricesjundiai&limit=9')
        if (!response.ok) return

        const data = await response.json()
        if (!isMounted || !data?.ok || !Array.isArray(data.items) || data.items.length === 0) return

        setInstagramFeed(data.items)
      } catch {
        // Keep local fallback feed when Instagram blocks the request
      }
    }

    loadInstagramFeed()
    return () => {
      isMounted = false
    }
  }, [])

  const metrics = useMemo(() => {
    const unitsPerBox = 12
    const monthlyProfit = boxesPerWeek * unitsPerBox * unitMargin * 4.33
    const paybackMonths = firstOrder > 0 ? firstOrder / monthlyProfit : 0
    const annualRoi = firstOrder > 0 ? ((monthlyProfit * 12 - firstOrder) / firstOrder) * 100 : 0

    return {
      monthlyProfit,
      paybackMonths,
      annualRoi,
    }
  }, [boxesPerWeek, unitMargin, firstOrder])

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-brand-cream text-brand-ink antialiased">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(200,16,46,0.16),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(34,139,34,0.14),transparent_32%),linear-gradient(to_bottom,#fff8f0_0%,#faf4e8_50%,#fff8f0_100%)]" />

          <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 pt-6 sm:px-6 lg:px-10 lg:pt-8">
            <BrandLockup />
            <MotionAnchor
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="hidden items-center gap-2 border border-brand-red-dark bg-brand-red px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-brand-red-dark sm:inline-flex"
            >
              Quero Revender
              <ArrowRight className="h-3.5 w-3.5" />
            </MotionAnchor>
          </header>

          <main className="relative z-10 pb-28">
            <SectionReveal className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-16 lg:pt-14">
              <div className="relative">
                <div className="absolute -left-8 -top-8 h-28 w-28 bg-brand-red/20 blur-2xl" />
                <span className="inline-flex items-center gap-2 border border-brand-green/35 bg-brand-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
                  Parceria B2B em Jundiai-SP
                </span>
                <h1 className="mt-5 max-w-2xl text-balance font-display text-4xl leading-[0.98] text-brand-wine sm:text-5xl lg:text-6xl">
                  Leve o Sabor Artesanal Autentico de Jundiai para sua Prateleira
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-ink/85 sm:text-lg">
                  Molhos 100% naturais, 16 sabores, margem premium e giro garantido. Nao ter
                  Caseirices na prateleira = cliente insatisfeito e venda perdida.
                </p>

                <div className="mt-7 grid gap-2 sm:grid-cols-3">
                  {[
                    ['16 Sabores', 'Sortimento que gira'],
                    ['100% Natural', 'Sem conservantes'],
                    ['Desde 2017', 'Marca local premium'],
                  ].map(([title, subtitle]) => (
                    <div
                      key={title}
                      className="border border-brand-earth/20 bg-white/80 px-3 py-2 backdrop-blur-sm"
                    >
                      <p className="text-xs font-extrabold uppercase tracking-[0.09em] text-brand-wine">
                        {title}
                      </p>
                      <p className="mt-1 text-[11px] text-brand-ink/75">{subtitle}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <MotionAnchor
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noreferrer"
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                    className="inline-flex w-full items-center justify-center gap-2 border border-brand-red-dark bg-brand-red px-5 py-4 text-center text-sm font-extrabold uppercase tracking-[0.07em] text-white shadow-[0_22px_50px_rgba(139,0,0,0.32)] transition hover:bg-brand-red-dark sm:w-auto"
                  >
                    QUERO TABELA DE ATACADO E CONDICOES DE REVENDA
                    <ArrowRight className="h-4 w-4" />
                  </MotionAnchor>
                  <a
                    href={INSTAGRAM_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 border border-brand-earth/25 bg-white/80 px-5 py-4 text-sm font-semibold text-brand-ink transition hover:bg-white sm:w-auto"
                  >
                    <Instagram className="h-4 w-4 text-brand-green" />
                    Ver Instagram da Marca
                  </a>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 border border-brand-earth/20 bg-brand-cream/85 px-3 py-2 text-xs font-medium text-brand-ink/85">
                  <Sparkles className="h-3.5 w-3.5 text-brand-green" />
                  Nao e molho comum: e produto de vitrine com valor percebido alto.
                </div>
              </div>

              <m.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? undefined : { duration: 0.65, ease: 'easeOut' }}
                className="relative overflow-hidden border border-brand-earth/28 bg-[#25120c] shadow-[0_35px_70px_rgba(35,14,8,0.5)]"
              >
                <div className="relative aspect-[4/5]">
                  <video
                    className="h-full w-full object-cover"
                    autoPlay={!shouldReduceMotion}
                    muted
                    loop
                    playsInline
                    poster="/assets/products/real/linha-completa.jpg"
                  >
                    <source src="/assets/hero/hero-farmer.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,6,4,0.78)_0%,rgba(14,6,4,0.34)_40%,rgba(14,6,4,0.15)_100%)]" />
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 border border-white/30 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                      Fazenda Moderna
                    </span>
                    <span className="inline-flex items-center gap-1 border border-white/30 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                      <Video className="h-3.5 w-3.5" />
                      Real Footage
                    </span>
                  </div>
                  <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2">
                    <div className="border border-white/25 bg-black/35 p-3 text-center text-white backdrop-blur">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/75">Sabores</p>
                      <p className="mt-1 text-xl font-bold">16</p>
                    </div>
                    <div className="border border-white/25 bg-black/35 p-3 text-center text-white backdrop-blur">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/75">Natural</p>
                      <p className="mt-1 text-xl font-bold">100%</p>
                    </div>
                    <div className="border border-white/25 bg-black/35 p-3 text-center text-white backdrop-blur">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/75">Giro</p>
                      <p className="mt-1 text-xl font-bold">Alto</p>
                    </div>
                  </div>
                </div>
              </m.div>
            </SectionReveal>

            <SectionReveal className="mx-auto max-w-7xl px-4 pb-10 pt-2 sm:px-6 lg:px-10 lg:pb-16">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {benefits.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <article
                      key={item.title}
                      className="group relative overflow-hidden border border-brand-earth/25 bg-white/85 p-6 shadow-[0_16px_40px_rgba(55,27,16,0.08)]"
                    >
                      <div className="absolute -right-10 -top-10 h-24 w-24 bg-brand-green/10 blur-2xl transition group-hover:bg-brand-red/10" />
                      <IconComponent className="relative h-6 w-6 text-brand-green" />
                      <h3 className="relative mt-4 font-display text-2xl leading-tight text-brand-wine">
                        {item.title}
                      </h3>
                      <p className="relative mt-2 text-sm leading-relaxed text-brand-ink/82">{item.text}</p>
                    </article>
                  )
                })}
              </div>
            </SectionReveal>

            <SectionReveal className="border-y border-brand-earth/18 bg-white/60 py-14 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-3xl text-brand-wine sm:text-4xl">Vitrine de Produtos</h2>
                    <p className="mt-2 max-w-2xl text-sm text-brand-ink/82 sm:text-base">
                      Nao e catalogo comum: e uma linha pensada para girar rapido e valorizar sua
                      gôndola com linguagem visual premium.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 border border-brand-earth/25 bg-brand-cream px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-earth">
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
                      transition={
                        shouldReduceMotion ? undefined : { duration: 0.38, delay: index * 0.02 }
                      }
                      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
                      className="group overflow-hidden border border-brand-earth/20 bg-white shadow-[0_10px_28px_rgba(49,24,12,0.09)]"
                    >
                      <div className="relative aspect-[1/1] overflow-hidden bg-brand-cream">
                        <img
                          src={item.image}
                          alt={`Frasco do sabor ${item.name} da Caseirices`}
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

            <SectionReveal className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-20">
              <article className="border border-brand-earth/25 bg-white/85 p-7 shadow-[0_18px_40px_rgba(55,27,16,0.09)] lg:p-9">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-green">
                  Por que Caseirices?
                </p>
                <h2 className="mt-3 font-display text-3xl leading-tight text-brand-wine sm:text-4xl">
                  Confiabilidade de fabrica local com padrao premium
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-brand-ink/85 sm:text-base">
                  Desde 2017, dois amigos transformaram receitas autorais em uma operacao solida com
                  loja-fabrica propria em Jundiai. Isso garante controle de qualidade, agilidade de
                  reposicao e relacao comercial proxima com cada revendedor.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink/85 sm:text-base">
                  A proposta e simples: produto forte, margem alta e uma parceria de crescimento
                  continuo para supermercados, emporios gourmet, restaurantes e hoteis.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    ['Desde 2017', 'Historico de marca local'],
                    ['Loja-fabrica', 'Producao propria e rastreavel'],
                    ['Logistica agil', 'Reposicao com previsibilidade'],
                    ['Suporte ativo', 'Apoio real ao sell-out'],
                  ].map(([title, text]) => (
                    <div key={title} className="border border-brand-earth/18 bg-brand-cream/75 p-3">
                      <p className="text-sm font-bold text-brand-wine">{title}</p>
                      <p className="mt-1 text-xs text-brand-ink/80">{text}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="relative overflow-hidden border border-brand-earth/35 bg-brand-wine p-7 text-brand-cream shadow-[0_20px_46px_rgba(55,27,16,0.28)] lg:p-9">
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
                    <div className="border border-brand-cream/30 bg-black/20 p-4 backdrop-blur">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-brand-cream/75">
                        Lucro mensal estimado
                      </p>
                      <p className="mt-1 font-display text-2xl text-brand-green">
                        {formatMoney(metrics.monthlyProfit)}
                      </p>
                    </div>
                    <div className="border border-brand-cream/30 bg-black/20 p-4 backdrop-blur">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-brand-cream/75">
                        Payback
                      </p>
                      <p className="mt-1 font-display text-2xl text-brand-green">
                        {metrics.paybackMonths.toFixed(1)} meses
                      </p>
                    </div>
                    <div className="border border-brand-cream/30 bg-black/20 p-4 backdrop-blur">
                      <p className="text-[11px] uppercase tracking-[0.12em] text-brand-cream/75">
                        ROI anual
                      </p>
                      <p className="mt-1 font-display text-2xl text-brand-green">
                        {metrics.annualRoi.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </SectionReveal>

            <SectionReveal className="border-y border-brand-earth/18 bg-white/65 py-14 lg:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                <h2 className="font-display text-3xl text-brand-wine sm:text-4xl">
                  Materiais de Apoio para Revendedores
                </h2>
                <p className="mt-2 max-w-3xl text-sm text-brand-ink/82 sm:text-base">
                  Voce recebe estrutura comercial para vender mais desde a primeira semana.
                </p>
                <div className="mt-7 grid gap-4 md:grid-cols-3">
                  {supportItems.map((item) => {
                    const IconComponent = item.icon
                    return (
                      <article
                        key={item.title}
                        className="border border-brand-earth/20 bg-white p-5 shadow-[0_12px_28px_rgba(55,27,16,0.08)]"
                      >
                        <IconComponent className="h-6 w-6 text-brand-green" />
                        <h3 className="mt-4 font-display text-2xl leading-tight text-brand-wine">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-brand-ink/85">{item.text}</p>
                      </article>
                    )
                  })}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-3xl text-brand-wine sm:text-4xl">Instagram da Marca</h2>
                  <p className="mt-2 text-sm text-brand-ink/80 sm:text-base">
                    Conteudo real da marca @caseiricesjundiai para apoiar credibilidade no PDV.
                  </p>
                </div>
                <a
                  href={INSTAGRAM_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-brand-earth/20 bg-white px-3 py-2 text-sm font-semibold text-brand-green transition hover:text-brand-wine"
                >
                  <Instagram className="h-4 w-4" /> @caseiricesjundiai
                </a>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                    className="group relative aspect-square overflow-hidden border border-brand-earth/22 bg-white"
                  >
                    <img
                      src={item.image}
                      alt={`Publicacao ${index + 1} do Instagram da Caseirices`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {item.isVideo ? (
                      <span className="absolute right-2 top-2 inline-flex items-center gap-1 border border-white/40 bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                        <Video className="h-3 w-3" />
                        Video
                      </span>
                    ) : null}
                  </m.a>
                ))}
              </div>
            </SectionReveal>
          </main>

          <footer className="relative z-10 border-t border-brand-earth/25 bg-brand-wine px-4 py-8 text-brand-cream sm:px-6 lg:px-10">
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
        </div>

        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="pointer-events-auto mx-auto w-full border border-brand-red-dark bg-brand-red px-3 py-3 shadow-[0_18px_40px_rgba(139,0,0,0.38)] lg:ml-auto lg:mr-0 lg:max-w-md">
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                Parceria comercial premium
              </p>
              <MotionAnchor
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                className="mt-2 inline-flex w-full items-center justify-center gap-2 border border-white/35 bg-brand-red-dark px-4 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:bg-[#6c1010]"
              >
                Quero tabela e condicoes
                <ArrowRight className="h-4 w-4" />
              </MotionAnchor>
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}

export default App
