import fs from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const promptFile = path.join(root, 'prompts', 'dalle-caseirices-products.json')
const outputDir = path.join(root, 'public', 'assets', 'products', 'real')

async function main() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY nao definido no ambiente.')
  }

  const raw = await fs.readFile(promptFile, 'utf8')
  const cfg = JSON.parse(raw)
  const model = cfg.model || 'gpt-image-1'
  const size = cfg.size || '1024x1024'
  const quality = cfg.quality || 'high'
  const base = cfg.style_base || ''
  const items = Array.isArray(cfg.products) ? cfg.products : []

  if (items.length === 0) {
    throw new Error('Nenhum produto encontrado no arquivo de prompts.')
  }

  await fs.mkdir(outputDir, { recursive: true })

  for (const item of items) {
    const prompt = `${base} ${item.prompt}`.trim()
    const body = {
      model,
      prompt,
      size,
      quality,
      output_format: 'jpeg',
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Falha ao gerar "${item.name}": ${response.status} ${err}`)
    }

    const json = await response.json()
    const b64 = json?.data?.[0]?.b64_json
    if (!b64) {
      throw new Error(`Resposta sem imagem para "${item.name}".`)
    }

    const buffer = Buffer.from(b64, 'base64')
    const outputPath = path.join(outputDir, item.filename)
    await fs.writeFile(outputPath, buffer)
    console.log(`Gerado: ${outputPath}`)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
