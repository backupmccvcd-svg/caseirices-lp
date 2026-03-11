import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react'
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowRight, ChefHat, Clock3, Leaf, ShoppingBag, Sparkles } from 'lucide-react'

const sauceFrames = Object.entries(
  import.meta.glob('../HERO/*.jpg', { eager: true, import: 'default' }),
)
  .sort(([leftPath], [rightPath]) => {
    const leftMatch = leftPath.match(/frame-(\d+)/)
    const rightMatch = rightPath.match(/frame-(\d+)/)
    return Number(leftMatch?.[1] ?? 0) - Number(rightMatch?.[1] ?? 0)
  })
  .map(([, source]) => source)
const sampledSauceFrames = sauceFrames.filter(
  (_, index) => index % 3 === 0 || index === sauceFrames.length - 1,
)

const MotionAnchor = m.a
const MotionDiv = m.div
const SEQUENCE_START_FRAME = 0

const BUY_LINK =
  'https://wa.me/5511974884319?text=Olá!+Quero+conhecer+o+Molho+de+Tomate+Caseirices+e+saber+como+comprar.'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Ingredientes', href: '#ingredientes' },
  { label: 'Receitas', href: '#receitas' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Comprar', href: '#comprar' },
]

const STORY_PANELS = [
  {
    eyebrow: 'Molho de Tomate Caseirices',
    title: 'O sabor de verdade começa aqui.',
    body: [
      'Feito com tomates selecionados e receitas tradicionais.',
      'Uma narrativa de textura, calor e cozinha feita sem atalhos.',
    ],
    align: 'center',
    range: [0, 0.18],
    actions: [
      { label: 'Conhecer o Molho', href: '#ingredientes', variant: 'primary' },
      { label: 'Ver Receitas', href: '#receitas', variant: 'secondary', liquid: true },
    ],
  },
  {
    eyebrow: 'Ingredientes de verdade',
    title: 'Tomates maduros, colhidos no ponto certo.',
    body: [
      'Receitas que respeitam o tempo e o sabor.',
      'Sem atalhos. Apenas o essencial.',
    ],
    align: 'left',
    range: [0.15, 0.42],
  },
  {
    eyebrow: 'Textura e profundidade',
    title: 'Sabor que transforma qualquer receita.',
    body: [
      'Uma textura rica.',
      'Um sabor equilibrado.',
      'O molho que transforma pratos simples em momentos especiais.',
    ],
    align: 'right',
    range: [0.4, 0.67],
  },
  {
    eyebrow: 'Cozinha afetiva',
    title: 'Tradição em cada colher.',
    body: [
      'Receitas inspiradas na cozinha caseira.',
      'O sabor que lembra almoço de família.',
    ],
    align: 'center',
    range: [0.64, 0.87],
  },
  {
    eyebrow: 'Pronto para a mesa',
    title: 'Experimente Caseirices.',
    body: ['O molho que faz a diferença.'],
    align: 'center',
    range: [0.84, 1],
    actions: [
      { label: 'Comprar Agora', href: BUY_LINK, variant: 'primary' },
      { label: 'Ver Receitas', href: '#receitas', variant: 'secondary', liquid: true },
    ],
  },
]

const INGREDIENT_CHIPS = [
  {
    label: 'Tomates selecionados',
    accent: '#D62828',
    className: 'left-[8%] top-[20%] md:left-[11%] md:top-[28%]',
    range: [0.15, 0.38],
  },
  {
    label: 'Manjericão fresco',
    accent: '#2F7D32',
    className: 'right-[9%] top-[24%] md:right-[12%] md:top-[22%]',
    range: [0.2, 0.44],
  },
  {
    label: 'Alho dourado',
    accent: '#F4A261',
    className: 'left-[10%] bottom-[24%] md:left-[15%] md:bottom-[28%]',
    range: [0.24, 0.5],
  },
  {
    label: 'Azeite extra virgem',
    accent: '#F4A261',
    className: 'right-[10%] bottom-[20%] md:right-[16%] md:bottom-[30%]',
    range: [0.3, 0.58],
  },
]

const SIGNATURE_INGREDIENTS = [
  {
    title: 'Tomate no auge',
    text: 'Cor profunda, doçura natural e acidez equilibrada para um molho que nasce do fruto, não do extrato.',
  },
  {
    title: 'Manjericão fresco',
    text: 'Um perfume verde e limpo que entra para levantar o molho sem roubar a cena do tomate.',
  },
  {
    title: 'Alho e tempo',
    text: 'Camadas de sabor construídas devagar, com fogo controlado e memória de receita de família.',
  },
  {
    title: 'Azeite e brilho',
    text: 'Toque final para entregar textura aveludada, reflexos quentes e finalização elegante.',
  },
]

const RECIPE_MOMENTS = [
  {
    title: 'Pasta do domingo',
    text: 'Tagliarini cremoso, tomate fresco e manjericão para uma mesa de domingo com cara de trattoria.',
    image: '/assets/recipes/pasta-domingo.jpg',
    imagePosition: '58% 42%',
    sauce: 'Sugo Basilico Caseirices',
    time: '35 min',
    serves: '2 porções',
    ingredients: [
      '250g de massa longa fresca ou seca',
      '1 xícara de Sugo Basilico Caseirices',
      'Tomates-cereja, parmesão e folhas de manjericão',
    ],
    steps: [
      'Cozinhe a massa até ficar al dente e reserve meia xícara da água do cozimento.',
      'Aqueça o molho Caseirices com os tomates-cereja até ganhar brilho e textura mais aveludada.',
      'Misture a massa, ajuste com a água reservada e finalize com parmesão e manjericão fresco.',
    ],
  },
  {
    title: 'Bruschetta quente',
    text: 'Pão tostado, tomate, queijo e ervas em uma entrada quente com personalidade imediata.',
    image: '/assets/recipes/bruschetta-quente.jpg',
    imagePosition: '48% 72%',
    sauce: 'Molho Sugo Caseirices',
    time: '20 min',
    serves: '6 unidades',
    ingredients: [
      '6 fatias de pão rústico',
      '3 colheres de Molho Sugo Caseirices',
      'Queijo em lâminas, tomate em rodelas e azeite',
    ],
    steps: [
      'Toste o pão até criar uma crosta firme e dourada.',
      'Espalhe uma camada fina de molho, acomode o queijo e os tomates por cima.',
      'Leve ao forno por alguns minutos e finalize com azeite, sal e ervas frescas.',
    ],
  },
  {
    title: 'Mesa compartilhada',
    text: 'Um prato central para dividir, com legumes, carne dourada e molho servindo como amarra da experiência.',
    image: '/assets/recipes/mesa-compartilhada.jpg',
    imagePosition: '50% 78%',
    sauce: 'Assado Caseirices',
    time: '45 min',
    serves: '4 porções',
    ingredients: [
      'Proteína grelhada ou legumes assados para servir ao centro',
      '1 xícara de molho Assado Caseirices',
      'Folhas verdes, legumes cozidos e um pão de apoio',
    ],
    steps: [
      'Monte a base da travessa com legumes e folhas para criar volume e contraste.',
      'Aqueça o molho Assado Caseirices e use como finalização quente sobre a proteína.',
      'Leve à mesa com pão crocante para compartilhar e servir em camadas.',
    ],
  },
]

const BRAND_NOTES = [
  'Receitas inspiradas na cozinha caseira, com textura densa e acabamento brilhante.',
  'Produção autoral que trata sabor e origem como parte da experiência, não como detalhe.',
  'Uma presença de marca que combina rusticidade, sofisticação e apetite visual.',
]

const CRITICAL_IMAGE_SOURCES = [
  '/assets/brand/caseirices-logo-hero.png',
  '/assets/hero/fundador-dono.png',
  '/assets/products/real/sugo-basilico.jpg',
  '/assets/products/real/sugo-350.jpg',
  '/assets/products/real/linha-completa.jpg',
]

function drawImageCover(canvas, image) {
  if (!canvas || !image) return

  const context = canvas.getContext('2d')
  if (!context) return

  const { clientWidth, clientHeight } = canvas
  if (!clientWidth || !clientHeight) return

  const pixelRatio = window.devicePixelRatio || 1
  const targetWidth = Math.round(clientWidth * pixelRatio)
  const targetHeight = Math.round(clientHeight * pixelRatio)

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth
    canvas.height = targetHeight
  }

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  context.clearRect(0, 0, clientWidth, clientHeight)

  const imageRatio = image.naturalWidth / image.naturalHeight
  const canvasRatio = clientWidth / clientHeight

  let drawWidth = clientWidth
  let drawHeight = clientHeight
  let offsetX = 0
  let offsetY = 0

  if (imageRatio > canvasRatio) {
    drawHeight = clientHeight
    drawWidth = drawHeight * imageRatio
    offsetX = (clientWidth - drawWidth) / 2
  } else {
    drawWidth = clientWidth
    drawHeight = drawWidth / imageRatio
    offsetY = (clientHeight - drawHeight) / 2
  }

  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
}

function isExternalLink(href) {
  return /^https?:\/\//.test(href)
}

function BrandLogo() {
  return (
    <a href="#home" className="inline-flex items-center">
      <img
        src="/assets/brand/caseirices-logo-hero.png"
        alt="Caseirices"
        className="h-10 w-auto sm:h-11"
      />
    </a>
  )
}

function ButtonLink({ href, variant = 'primary', liquid = false, children, className = '' }) {
  const shouldReduceMotion = useReducedMotion()
  const isExternal = isExternalLink(href)
  const variants = {
    primary:
      'border border-[#f6d8bc]/25 bg-[linear-gradient(135deg,#D62828_0%,#8D1B1B_100%)] text-white shadow-[0_22px_60px_rgba(118,15,15,0.42)] hover:brightness-110 focus-visible:ring-[#f4a261]',
    secondary:
      'border border-white/18 bg-white/8 text-[#f6ead6] backdrop-blur-xl hover:bg-white/12 focus-visible:ring-white/80',
    light:
      'border border-[#3f2722]/12 bg-[#f3e7d6] text-[#241614] shadow-[0_22px_50px_rgba(16,8,6,0.12)] hover:bg-white focus-visible:ring-[#D62828]',
  }
  const liquidClass =
    liquid && variant !== 'light'
      ? 'tomato-btn tomato-btn--dark border-[#ff6b4a]/45 bg-[rgba(255,255,255,0.03)] text-white shadow-[0_22px_60px_rgba(118,15,15,0.26)] hover:brightness-100'
      : liquid
        ? 'tomato-btn tomato-btn--light border-[#3f2722]/18 bg-[rgba(243,231,214,0.92)] text-[#241614] shadow-[0_18px_44px_rgba(16,8,6,0.14)] hover:brightness-100'
        : variants[variant]

  return (
    <MotionAnchor
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold tracking-[0.08em] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${liquidClass} ${className}`}
    >
      {liquid ? (
        <span className="tomato-btn__content">{children}</span>
      ) : (
        children
      )}
    </MotionAnchor>
  )
}

function StoryPanel({ panel }) {
  const alignments = {
    center: 'mx-auto items-center text-center',
    left: 'mr-auto items-start text-left',
    right: 'ml-auto items-start text-right lg:items-end',
  }

  return (
    <section className="relative flex min-h-screen items-center px-6 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-16 lg:pt-40">
      <div
        className={`relative z-30 flex w-full ${panel.align === 'center' ? 'justify-center' : panel.align === 'right' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`pointer-events-auto flex max-w-2xl flex-col rounded-[32px] border border-white/10 bg-[rgba(18,10,10,0.32)] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-10 ${alignments[panel.align]}`}
        >
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#f4a261] sm:text-sm">
          {panel.eyebrow}
        </p>
        <h1 className="mt-5 font-display text-[clamp(3rem,7vw,6.4rem)] leading-[0.88] text-[#fff6eb]">
          {panel.title}
        </h1>
        <div className="mt-5 space-y-2 text-base leading-relaxed text-[#f8e7d4]/84 sm:text-lg">
          {panel.body.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {panel.actions ? (
          <div
            className={`mt-8 flex flex-wrap items-center gap-3 ${
              panel.align === 'center'
                ? 'justify-center'
                : panel.align === 'right'
                  ? 'justify-end'
                  : 'justify-start'
            }`}
          >
            {panel.actions.map((action) => (
              <ButtonLink
                key={action.label}
                href={action.href}
                variant={action.variant}
                liquid={action.liquid}
              >
                {action.label}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            ))}
          </div>
        ) : null}
        </div>
      </div>
    </section>
  )
}

function IngredientChip({ progress, item }) {
  const [start, end] = item.range
  const opacity = useTransform(progress, [start, start + 0.05, end], [0, 1, 0])
  const y = useTransform(progress, [start, end], [32, -16])
  const x = useTransform(progress, [start, end], [-10, 8])

  return (
    <MotionDiv
      style={{ opacity, y, x }}
      className={`absolute z-20 hidden rounded-full border border-white/12 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f9efe2] shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl md:block ${item.className}`}
    >
      <span className="inline-flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
          style={{ backgroundColor: item.accent, color: item.accent }}
        />
        {item.label}
      </span>
    </MotionDiv>
  )
}

function RecipeFlipCard({ recipe, isFlipped, onToggle }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group block w-full text-left [perspective:2200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4a261] focus-visible:ring-offset-2 focus-visible:ring-offset-[#120d0d] ${
        isFlipped ? 'h-[46rem] lg:h-[52rem]' : 'h-[34rem] lg:h-[35rem]'
      }`}
    >
      <MotionDiv
        animate={shouldReduceMotion ? { rotateY: 0 } : { rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-[30px] border border-white/10 bg-[#1b1413] shadow-[0_26px_60px_rgba(0,0,0,0.22)] [backface-visibility:hidden]">
          <div className="relative h-full">
            <img
              src={recipe.image}
              alt={recipe.title}
              loading="lazy"
              decoding="async"
              style={{ objectPosition: recipe.imagePosition ?? 'center center' }}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,7,7,0.08)_0%,rgba(12,7,7,0.18)_28%,rgba(12,7,7,0.82)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f4a261]">Receitas</p>
              <h3 className="mt-3 font-display text-4xl leading-none text-[#fff3e6]">{recipe.title}</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/72">{recipe.text}</p>
              <div className="mt-5 flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-white/58">
                <span>{recipe.sauce}</span>
                <span>{isFlipped ? 'Fechar receita' : 'Clique para abrir'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-[30px] border border-[#f4a261]/18 bg-[radial-gradient(circle_at_top,rgba(244,162,97,0.12),transparent_26%),linear-gradient(180deg,#241614_0%,#120d0d_100%)] p-5 text-[#fff1e2] shadow-[0_30px_80px_rgba(0,0,0,0.28)] [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-6">
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f4a261]">Receita Caseirices</p>
                <h3 className="mt-3 font-display text-3xl leading-none text-[#fff6eb] sm:text-[2.15rem]">{recipe.title}</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/66">
                virar
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.18em] text-white/70">
              <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2">{recipe.sauce}</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2">
                <Clock3 className="h-3.5 w-3.5" />
                {recipe.time}
              </span>
              <span className="rounded-full border border-white/10 bg-white/6 px-3 py-2">{recipe.serves}</span>
            </div>

            <div className="mt-5 grid flex-1 gap-4">
              <div className="rounded-[24px] border border-white/8 bg-white/5 p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f4a261]">Ingredientes</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {recipe.ingredients.map((ingredient) => (
                    <p key={ingredient} className="rounded-[18px] border border-white/8 bg-black/10 px-4 py-3 text-sm leading-relaxed text-white/78">
                      {ingredient}
                    </p>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(214,40,40,0.16),rgba(18,13,13,0.18))] p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f4a261]">Modo de preparo</p>
                <div className="mt-4 space-y-3">
                  {recipe.steps.map((step, index) => (
                    <div key={step} className="flex gap-3 rounded-[18px] border border-white/8 bg-black/10 px-4 py-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D62828] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-white/78">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>
    </button>
  )
}

function App() {
  const scrollytellingRef = useRef(null)
  const heroCanvasRef = useRef(null)
  const preloadedFrameImagesRef = useRef([])
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const { scrollYProgress } = useScroll({
    target: scrollytellingRef,
    offset: ['start start', 'end end'],
  })

  const defaultFrame = Math.floor((sauceFrames.length - 1) * 0.58)
  const [activeFrame, setActiveFrame] = useState(shouldReduceMotion ? defaultFrame : SEQUENCE_START_FRAME)
  const [navSolid, setNavSolid] = useState(false)
  const [activeRecipe, setActiveRecipe] = useState(null)
  const [isPreloading, setIsPreloading] = useState(true)
  const [preloadProgress, setPreloadProgress] = useState(0)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const handleViewportChange = (event) => {
      setIsMobileViewport(event.matches)
    }

    setIsMobileViewport(mediaQuery.matches)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleViewportChange)
    } else {
      mediaQuery.addListener(handleViewportChange)
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleViewportChange)
      } else {
        mediaQuery.removeListener(handleViewportChange)
      }
    }
  }, [])

  const usesStaticHero = isMobileViewport || shouldReduceMotion
  const activeSequenceFrames = useMemo(
    () => (usesStaticHero ? [sauceFrames[0]] : sampledSauceFrames),
    [usesStaticHero],
  )

  const drawCurrentHeroFrame = useEffectEvent((frameIndex = activeFrame) => {
    const frameImage = preloadedFrameImagesRef.current[frameIndex]
    if (!frameImage) return
    drawImageCover(heroCanvasRef.current, frameImage)
  })

  useEffect(() => {
    setActiveFrame(SEQUENCE_START_FRAME)
  }, [usesStaticHero])

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setNavSolid(latest > 40)
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (usesStaticHero) return
    const usableFrameCount = Math.max(activeSequenceFrames.length - 1 - SEQUENCE_START_FRAME, 1)
    const nextFrame = SEQUENCE_START_FRAME + Math.round(latest * usableFrameCount)
    setActiveFrame((currentFrame) => (currentFrame === nextFrame ? currentFrame : nextFrame))
  })

  useEffect(() => {
    if (typeof window === 'undefined' || usesStaticHero) return undefined

    const root = document.documentElement
    const body = document.body
    const previousRootOverflow = root.style.overflow
    const previousBodyOverflow = body.style.overflow
    root.style.overflow = 'hidden'
    body.style.overflow = 'hidden'

    return () => {
      root.style.overflow = previousRootOverflow
      body.style.overflow = previousBodyOverflow
    }
  }, [usesStaticHero])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    if (usesStaticHero) {
      preloadedFrameImagesRef.current = []
      setPreloadProgress(100)
      setIsPreloading(false)
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      return undefined
    }

    if (activeSequenceFrames.length === 0) return undefined

    let cancelled = false
    const frameImages = new Array(activeSequenceFrames.length)
    const totalAssets = activeSequenceFrames.length + CRITICAL_IMAGE_SOURCES.length
    let loadedAssets = 0

    const updateProgress = () => {
      if (cancelled) return
      const nextProgress = Math.round((loadedAssets / totalAssets) * 100)
      setPreloadProgress(nextProgress)
    }

    const preloadFrame = (source, index) =>
      new Promise((resolve) => {
        const image = new window.Image()
        image.decoding = 'async'

        const finalize = async () => {
          try {
            if (typeof image.decode === 'function') {
              await image.decode()
            }
          } catch {
            // Ignore decode failures and rely on the browser cache once requested.
          }

          frameImages[index] = image
          loadedAssets += 1
          updateProgress()
          resolve()
        }

        image.onload = finalize
        image.onerror = finalize
        image.src = source

        if (image.complete) {
          finalize()
        }
      })

    const preloadSupportImage = (source) =>
      new Promise((resolve) => {
        const image = new window.Image()
        image.decoding = 'async'

        const finalize = async () => {
          try {
            if (typeof image.decode === 'function') {
              await image.decode()
            }
          } catch {
            // Ignore decode failures and rely on the browser cache once requested.
          }

          loadedAssets += 1
          updateProgress()
          resolve()
        }

        image.onload = finalize
        image.onerror = finalize
        image.src = source

        if (image.complete) {
          finalize()
        }
      })

    Promise.all([
      ...activeSequenceFrames.map((source, index) => preloadFrame(source, index)),
      ...CRITICAL_IMAGE_SOURCES.map(preloadSupportImage),
    ]).then(() => {
      if (cancelled) return
      preloadedFrameImagesRef.current = frameImages
      drawImageCover(heroCanvasRef.current, frameImages[SEQUENCE_START_FRAME] ?? frameImages[0])
      setPreloadProgress(100)
      window.requestAnimationFrame(() => {
        setIsPreloading(false)
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
      })
    })

    return () => {
      cancelled = true
    }
  }, [activeSequenceFrames, usesStaticHero])

  useEffect(() => {
    if (usesStaticHero) return undefined

    let frameRequest = 0
    frameRequest = window.requestAnimationFrame(() => {
      drawCurrentHeroFrame()
    })

    return () => {
      window.cancelAnimationFrame(frameRequest)
    }
  }, [activeFrame, usesStaticHero])

  useEffect(() => {
    if (usesStaticHero) return undefined

    let resizeRequest = 0
    const handleResize = () => {
      window.cancelAnimationFrame(resizeRequest)
      resizeRequest = window.requestAnimationFrame(() => {
        drawCurrentHeroFrame()
      })
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.cancelAnimationFrame(resizeRequest)
    }
  }, [activeFrame, usesStaticHero])

  const sauceScale = useTransform(scrollYProgress, [0, 0.18, 0.56, 1], [1.02, 1.1, 1.18, 1.26])
  const sauceY = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [0, 12, -6, -18])
  const sauceRotate = useTransform(scrollYProgress, [0, 0.55, 1], [0, 0, 0.5])
  const sauceOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18, 1], [0.55, 0.72, 0.94, 1])
  const sauceBlur = useTransform(scrollYProgress, [0, 0.16, 0.34, 1], [2, 1, 0, 0])
  const sauceFilter = useMotionTemplate`blur(${sauceBlur}px) saturate(1.08) contrast(1.04)`
  const haloOpacity = useTransform(scrollYProgress, [0, 0.22, 0.65, 1], [0.2, 0.5, 0.88, 0.7])
  const ambientOpacity = useTransform(scrollYProgress, [0, 0.18, 1], [0.35, 0.7, 1])
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.1, 0.18], [1, 0.65, 0])

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen overflow-x-clip bg-[#1A1A1A] text-[#f8e7d4] antialiased">
        {!usesStaticHero && isPreloading ? (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(214,40,40,0.18),transparent_24%),linear-gradient(180deg,#120d0d_0%,#1A1A1A_100%)] px-6">
            <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[rgba(18,10,10,0.54)] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
              <img
                src="/assets/brand/caseirices-logo-hero.png"
                alt="Caseirices"
                className="mx-auto h-14 w-auto"
              />
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#f4a261]">
                Preparando a experiência
              </p>
              <h2 className="mt-3 font-display text-4xl leading-none text-[#fff6eb]">
                Carregando o molho em alta resolução.
              </h2>
              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#f4a261_0%,#D62828_100%)] transition-[width] duration-300"
                  style={{ width: `${preloadProgress}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-white/66">{preloadProgress}%</p>
            </div>
          </div>
        ) : null}

        <header
          className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
            navSolid
              ? 'border-b border-white/8 bg-[rgba(14,10,10,0.68)] shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl'
              : 'bg-transparent'
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
            <BrandLogo />

            <nav className="hidden items-center gap-7 text-sm font-medium text-white/74 lg:flex">
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="transition hover:text-white">
                  {link.label}
                </a>
              ))}
            </nav>

            <ButtonLink href="#comprar" className="px-5 py-2.5 text-xs sm:text-sm">
              Comprar Agora
            </ButtonLink>
          </div>
        </header>

        <main>
          <section
            id="home"
            ref={scrollytellingRef}
            className="relative bg-[radial-gradient(circle_at_50%_8%,rgba(214,40,40,0.28),transparent_36%),radial-gradient(circle_at_16%_18%,rgba(244,162,97,0.12),transparent_32%),linear-gradient(180deg,#120d0d_0%,#1A1A1A_28%,#210f10_70%,#150f0f_100%)]"
          >
            <div className="sticky top-0 -mb-[100vh] h-screen overflow-hidden">
              <MotionDiv
                style={{ opacity: ambientOpacity }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(244,162,97,0.12),transparent_28%),radial-gradient(circle_at_50%_62%,rgba(214,40,40,0.24),transparent_36%)]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,5,5,0.58)_0%,rgba(7,5,5,0.18)_30%,rgba(7,5,5,0.26)_62%,rgba(7,5,5,0.7)_100%)]" />

              <MotionDiv
                style={{ opacity: haloOpacity }}
                className="absolute left-1/2 top-1/2 h-[72vh] w-[72vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,164,94,0.24)_0%,rgba(214,40,40,0.18)_30%,transparent_68%)] blur-3xl"
              />

              {usesStaticHero ? (
                <MotionDiv
                  style={{ scale: sauceScale, y: sauceY, opacity: sauceOpacity }}
                  className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
                >
                  <img
                    src={sauceFrames[0]}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    className="h-full w-full object-cover object-center"
                  />
                </MotionDiv>
              ) : (
                <MotionDiv
                  style={{
                    scale: sauceScale,
                    y: sauceY,
                    rotate: sauceRotate,
                    opacity: sauceOpacity,
                    filter: sauceFilter,
                  }}
                  className="pointer-events-none absolute inset-0 z-10 overflow-hidden drop-shadow-[0_50px_90px_rgba(0,0,0,0.45)] will-change-transform"
                >
                  <canvas
                    ref={heroCanvasRef}
                    aria-hidden="true"
                    className="h-full w-full"
                  />
                </MotionDiv>
              )}

              <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.10),transparent_14%),radial-gradient(circle_at_56%_50%,rgba(255,214,172,0.18),transparent_20%),radial-gradient(circle_at_34%_72%,rgba(255,255,255,0.04),transparent_22%)] mix-blend-screen" />
              <div className="absolute inset-0 z-20 bg-[linear-gradient(90deg,rgba(10,8,8,0.78)_0%,rgba(10,8,8,0.36)_35%,rgba(10,8,8,0.18)_62%,rgba(10,8,8,0.72)_100%)]" />

              {INGREDIENT_CHIPS.map((chip) => (
                <IngredientChip key={chip.label} progress={scrollYProgress} item={chip} />
              ))}

              <MotionDiv
                style={{ opacity: scrollHintOpacity }}
                className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center"
              >
                <p className="text-[11px] uppercase tracking-[0.34em] text-white/58">Role para provar a narrativa</p>
              </MotionDiv>
            </div>

            <div className="relative z-30">
              {STORY_PANELS.map((panel) => (
                <StoryPanel key={panel.title} panel={panel} />
              ))}
            </div>
          </section>

          <section
            id="ingredientes"
            className="relative z-40 isolate overflow-hidden border-t border-white/8 bg-[#f1e6d8] px-4 py-20 text-[#241614] sm:px-6 lg:px-10"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D62828] to-transparent" />
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8D1B1B]">
                  Ingredientes de verdade
                </p>
                <h2 className="mt-4 max-w-xl font-display text-5xl leading-[0.92] text-[#231515] sm:text-6xl">
                  O molho nasce do ingrediente, não do discurso.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-[#4b312b]/82 sm:text-lg">
                  Cada camada da receita foi pensada para parecer comida de verdade em primeiro
                  contato: cor quente, brilho sutil, aroma fresco e densidade visual de molho feito
                  em casa.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {SIGNATURE_INGREDIENTS.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-[26px] border border-[#3f2722]/10 bg-white/72 p-5 shadow-[0_18px_40px_rgba(24,10,8,0.08)] backdrop-blur-xl"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2F7D32]">
                        Essencial
                      </p>
                      <h3 className="mt-3 font-display text-3xl leading-none text-[#241614]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#4b312b]/80">{item.text}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-[30px] border border-[#3f2722]/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(246,226,204,0.8)_100%)] p-7 shadow-[0_24px_60px_rgba(24,10,8,0.10)] sm:col-span-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8D1B1B]">
                        Assinatura sensorial
                      </p>
                      <h3 className="mt-3 font-display text-4xl text-[#241614] sm:text-5xl">
                        Rusticidade com acabamento de campanha premium.
                      </h3>
                    </div>
                    <Sparkles className="mt-2 hidden h-8 w-8 text-[#D62828] sm:block" />
                  </div>
                  <div className="mt-6 space-y-4">
                    {BRAND_NOTES.map((note) => (
                      <p key={note} className="border-t border-[#3f2722]/10 pt-4 text-sm leading-relaxed text-[#4b312b]/82 sm:text-base">
                        {note}
                      </p>
                    ))}
                  </div>
                </article>

                <article className="rounded-[30px] border border-[#3f2722]/10 bg-[#241614] p-6 text-[#f6ead6] shadow-[0_24px_60px_rgba(24,10,8,0.20)]">
                  <Leaf className="h-8 w-8 text-[#2F7D32]" />
                  <h3 className="mt-5 font-display text-3xl">Fresco e vegetal</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/76">
                    Manjericão, alho e tomate aparecem como notas claras, não como ruído industrial.
                  </p>
                </article>

                <article className="rounded-[30px] border border-[#3f2722]/10 bg-[linear-gradient(180deg,#D62828_0%,#8D1B1B_100%)] p-6 text-white shadow-[0_24px_60px_rgba(118,15,15,0.28)]">
                  <Sparkles className="h-8 w-8 text-[#ffd8ad]" />
                  <h3 className="mt-5 font-display text-3xl">Brilho de azeite</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/78">
                    Reflexos quentes e textura viscosa que entregam apetite antes mesmo da primeira colherada.
                  </p>
                </article>
              </div>
            </div>
          </section>

          <section
            id="receitas"
            className="relative z-40 -mt-px overflow-visible bg-[#120d0d] px-4 py-20 sm:px-6 lg:px-10"
          >
            <div className="mx-auto max-w-7xl">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f4a261]">
                  Receitas e ocasiões
                </p>
                <h2 className="mt-4 font-display text-5xl leading-[0.92] text-[#fff6eb] sm:text-6xl">
                  O tipo de molho que vira clima de mesa.
                </h2>
                <p className="mt-5 text-base leading-relaxed text-white/70 sm:text-lg">
                  Da massa ao pão tostado, Caseirices foi pensado para virar protagonista sem pesar a
                  mão. O resultado é um produto que sustenta pratos simples com presença de restaurante.
                </p>
              </div>

              <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
                {RECIPE_MOMENTS.map((recipe) => (
                  <RecipeFlipCard
                    key={recipe.title}
                    recipe={recipe}
                    isFlipped={activeRecipe === recipe.title}
                    onToggle={() =>
                      setActiveRecipe((currentRecipe) =>
                        currentRecipe === recipe.title ? null : recipe.title,
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </section>

          <section
            id="sobre"
            className="relative z-40 overflow-hidden bg-[linear-gradient(180deg,#f1e6d8_0%,#eadcca_100%)] px-4 py-20 text-[#241614] sm:px-6 lg:px-10"
          >
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div className="overflow-hidden rounded-[34px] border border-[#3f2722]/10 bg-white/55 shadow-[0_30px_80px_rgba(24,10,8,0.10)]">
                <img
                  src="/assets/hero/fundador-dono.png"
                  alt="Fundador da Caseirices ao lado da linha de molhos"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#8D1B1B]">Sobre a marca</p>
                <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[0.92] text-[#231515] sm:text-6xl">
                  Uma estética premium construída sobre cozinha real.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#4b312b]/84 sm:text-lg">
                  Caseirices combina memória afetiva, ingredientes selecionados e produção autoral
                  para criar um molho que parece feito para filme gastronômico, mas continua fiel à
                  lógica da cozinha caseira: respeito ao tomate, calor, tempo e simplicidade bem
                  executada.
                </p>

                <div className="mt-8 grid gap-4">
                  <article className="rounded-[24px] border border-[#3f2722]/10 bg-white/78 p-5 shadow-[0_20px_50px_rgba(24,10,8,0.08)]">
                    <div className="flex items-center gap-3">
                      <ChefHat className="h-5 w-5 text-[#8D1B1B]" />
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8D1B1B]">
                        Tradição
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#4b312b]/82">
                      Receitas inspiradas no almoço de família, com textura densa e sabor equilibrado.
                    </p>
                  </article>

                  <article className="rounded-[24px] border border-[#3f2722]/10 bg-white/78 p-5 shadow-[0_20px_50px_rgba(24,10,8,0.08)]">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-[#D62828]" />
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8D1B1B]">
                        Presença visual
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#4b312b]/82">
                      Um produto com apelo cinematográfico, brilho apetitoso e acabamento digno de campanha premium.
                    </p>
                  </article>

                  <article className="rounded-[24px] border border-[#3f2722]/10 bg-white/78 p-5 shadow-[0_20px_50px_rgba(24,10,8,0.08)]">
                    <div className="flex items-center gap-3">
                      <Leaf className="h-5 w-5 text-[#2F7D32]" />
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8D1B1B]">
                        Essência
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#4b312b]/82">
                      O discurso da marca parte do sabor, da origem e da verdade dos ingredientes, nunca de efeito vazio.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section
            id="comprar"
            className="relative z-40 overflow-hidden bg-[radial-gradient(circle_at_50%_16%,rgba(214,40,40,0.24),transparent_28%),linear-gradient(180deg,#180f0f_0%,#120d0d_100%)] px-4 py-20 sm:px-6 lg:px-10"
          >
            <div className="mx-auto grid max-w-7xl gap-10 rounded-[36px] border border-white/8 bg-white/6 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.20)] backdrop-blur-2xl lg:grid-cols-[1.02fr_0.98fr] lg:p-10">
              <div className="flex flex-col justify-center">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f4a261]">Experimente Caseirices</p>
                <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[0.92] text-[#fff6eb] sm:text-6xl">
                  O molho que faz a diferença.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
                  Um tomate sauce premium, com textura encorpada, assinatura artesanal e presença de
                  marca pensada para encantar antes mesmo da primeira receita.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={BUY_LINK}>
                    Comprar Agora
                    <ShoppingBag className="h-4 w-4" />
                  </ButtonLink>
                  <ButtonLink href="#receitas" variant="secondary" liquid>
                    Ver Receitas
                    <ArrowRight className="h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>

              <div className="grid gap-5">
                <div className="overflow-hidden rounded-[28px] border border-white/8 bg-[#231515]">
                  <img
                    src="/assets/products/real/linha-completa.jpg"
                    alt="Linha de molhos Caseirices"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-[24px] border border-white/8 bg-[#231515]">
                    <img
                      src="/assets/products/real/sugo-350.jpg"
                      alt="Frasco do molho Caseirices"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/8 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f4a261]">Finalização</p>
                    <h3 className="mt-3 font-display text-4xl text-[#fff6eb]">Feito para impressionar sem perder a alma.</h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/72">
                      A experiência termina como começa: calor, profundidade e um molho com cara de
                      memória boa.
                    </p>
                    <ButtonLink href={BUY_LINK} variant="light" liquid className="mt-6 w-full">
                      Falar com a marca
                      <ArrowRight className="h-4 w-4" />
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </LazyMotion>
  )
}

export default App
