/**
 * Generate Premium Category Background Images
 *
 * Creates editorial, magazine-style background images
 * inspired by luxury designer apparel brands.
 */

import { createCanvas } from 'canvas'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const OUTPUT_DIR = join(process.cwd(), 'public', 'images', 'blanks', 'categories')

// Premium category styling with editorial feel
const categories = [
  {
    name: 'T-SHIRTS',
    subtitle: '& ACTIVEWEAR',
    tagline: 'ESSENTIALS',
    slug: 't-shirts-activewear',
    colors: { primary: '#dc2626', dark: '#0a0a0a', accent: '#404040' }
  },
  {
    name: 'FLEECE',
    subtitle: 'COLLECTION',
    tagline: 'COMFORT REDEFINED',
    slug: 'fleece',
    colors: { primary: '#b91c1c', dark: '#050505', accent: '#2a2a2a' }
  },
  {
    name: 'POLOS',
    subtitle: 'CLASSIC',
    tagline: 'TIMELESS STYLE',
    slug: 'polos',
    colors: { primary: '#dc2626', dark: '#080808', accent: '#333333' }
  },
  {
    name: 'HEADWEAR',
    subtitle: 'PREMIUM',
    tagline: 'FINISHING TOUCH',
    slug: 'headwear',
    colors: { primary: '#991b1b', dark: '#060606', accent: '#3d3d3d' }
  },
  {
    name: 'BAGS',
    subtitle: 'UTILITY',
    tagline: 'CARRY EVERYWHERE',
    slug: 'bags',
    colors: { primary: '#dc2626', dark: '#070707', accent: '#2f2f2f' }
  },
  {
    name: 'OUTERWEAR',
    subtitle: 'STATEMENT',
    tagline: 'BOLD EXPRESSION',
    slug: 'outerwear',
    colors: { primary: '#b91c1c', dark: '#040404', accent: '#363636' }
  },
  {
    name: 'WORKWEAR',
    subtitle: 'PROFESSIONAL',
    tagline: 'BUILT TO LAST',
    slug: 'workwear',
    colors: { primary: '#dc2626', dark: '#090909', accent: '#2a2a2a' }
  },
  {
    name: 'WOVEN',
    subtitle: 'SHIRTS',
    tagline: 'REFINED',
    slug: 'woven-shirts',
    colors: { primary: '#991b1b', dark: '#050505', accent: '#333333' }
  },
  {
    name: 'ACCESSORIES',
    subtitle: 'DETAILS',
    tagline: 'COMPLETE THE LOOK',
    slug: 'accessories',
    colors: { primary: '#dc2626', dark: '#060606', accent: '#2f2f2f' }
  },
]

const WIDTH = 1920
const HEIGHT = 1200

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

async function generatePremiumImage(category: typeof categories[0]) {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  // Sophisticated dark gradient
  const gradient = ctx.createRadialGradient(WIDTH/2, HEIGHT/2, 0, WIDTH/2, HEIGHT/2, WIDTH * 0.8)
  gradient.addColorStop(0, '#1a1a1a')
  gradient.addColorStop(0.5, category.colors.dark)
  gradient.addColorStop(1, '#000000')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // Subtle noise/texture overlay
  ctx.globalAlpha = 0.02
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#ffffff' : category.colors.primary
    ctx.fillRect(Math.random() * WIDTH, Math.random() * HEIGHT, 2, 2)
  }
  ctx.globalAlpha = 1.0

  // Large watermarked category name (editorial style)
  ctx.save()
  ctx.globalAlpha = 0.03
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 400px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.translate(WIDTH / 2, HEIGHT / 2)
  ctx.rotate(-Math.PI / 12)
  ctx.fillText(category.name, 0, 0)
  ctx.restore()

  // Geometric accent elements
  ctx.globalAlpha = 0.08
  ctx.strokeStyle = category.colors.primary
  ctx.lineWidth = 3

  // Corner accent lines
  const margin = 80
  ctx.beginPath()
  ctx.moveTo(margin, margin)
  ctx.lineTo(margin + 200, margin)
  ctx.moveTo(margin, margin)
  ctx.lineTo(margin, margin + 200)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(WIDTH - margin, HEIGHT - margin)
  ctx.lineTo(WIDTH - margin - 200, HEIGHT - margin)
  ctx.moveTo(WIDTH - margin, HEIGHT - margin)
  ctx.lineTo(WIDTH - margin, HEIGHT - margin - 200)
  ctx.stroke()

  // Central accent circle
  ctx.beginPath()
  ctx.arc(WIDTH / 2, HEIGHT / 2, 350, 0, Math.PI * 2)
  ctx.stroke()

  // Inner circle
  ctx.beginPath()
  ctx.arc(WIDTH / 2, HEIGHT / 2, 300, 0, Math.PI * 2)
  ctx.stroke()

  ctx.globalAlpha = 1.0

  // Thin accent lines
  ctx.strokeStyle = category.colors.primary
  ctx.lineWidth = 1

  // Top line
  ctx.beginPath()
  ctx.moveTo(WIDTH * 0.2, 100)
  ctx.lineTo(WIDTH * 0.8, 100)
  ctx.stroke()

  // Bottom line
  ctx.beginPath()
  ctx.moveTo(WIDTH * 0.2, HEIGHT - 100)
  ctx.lineTo(WIDTH * 0.8, HEIGHT - 100)
  ctx.stroke()

  // Main typography
  ctx.textAlign = 'center'

  // Small tagline at top
  ctx.fillStyle = category.colors.primary
  ctx.font = '300 18px Arial'
  ctx.fillText(category.tagline, WIDTH / 2, 130)

  // Main category name
  ctx.save()
  ctx.shadowColor = 'rgba(220, 38, 38, 0.5)'
  ctx.shadowBlur = 60

  ctx.fillStyle = '#ffffff'
  ctx.font = '300 140px Arial'

  // Calculate text positioning
  const nameY = HEIGHT / 2 - 40
  ctx.fillText(category.name, WIDTH / 2, nameY)

  // Subtitle
  ctx.font = '200 60px Arial'
  ctx.fillStyle = '#cccccc'
  ctx.shadowBlur = 30
  ctx.fillText(category.subtitle, WIDTH / 2, nameY + 80)

  ctx.restore()

  // Product count pill
  const pillWidth = 180
  const pillHeight = 50
  const pillX = WIDTH / 2 - pillWidth / 2
  const pillY = HEIGHT - 180

  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
  ctx.beginPath()
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 25)
  ctx.fill()

  ctx.strokeStyle = category.colors.primary
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#ffffff'
  ctx.font = '500 16px Arial'
  ctx.fillText('EXPLORE COLLECTION', WIDTH / 2, pillY + 32)

  // Small brand mark at bottom
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.font = '300 14px Arial'
  ctx.fillText('PRINTGUYS', WIDTH / 2, HEIGHT - 60)

  // Red accent bar at bottom
  const barGradient = ctx.createLinearGradient(WIDTH * 0.3, 0, WIDTH * 0.7, 0)
  barGradient.addColorStop(0, 'transparent')
  barGradient.addColorStop(0.5, category.colors.primary)
  barGradient.addColorStop(1, 'transparent')

  ctx.fillStyle = barGradient
  ctx.fillRect(0, HEIGHT - 3, WIDTH, 3)

  // Save image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 })
  const filename = `${category.slug}.jpg`
  await writeFile(join(OUTPUT_DIR, filename), buffer)

  console.log(`  ✓ ${filename}`)
}

async function main() {
  console.log('\n' + '═'.repeat(55))
  console.log('  GENERATING PREMIUM CATEGORY IMAGES')
  console.log('═'.repeat(55))
  console.log(`  Output: ${OUTPUT_DIR}\n`)

  await mkdir(OUTPUT_DIR, { recursive: true })

  for (const category of categories) {
    await generatePremiumImage(category)
  }

  console.log(`\n  ✓ Generated ${categories.length} images\n` + '═'.repeat(55) + '\n')
}

main().catch(console.error)
