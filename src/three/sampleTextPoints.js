/**
 * Samples a name into 2D points by rasterising it to an offscreen canvas and
 * reading back the opaque pixels. Keeps the WebGL moment data-driven: whatever
 * `personal.name` says in data.json is what the field resolves into, with no
 * baked geometry to maintain.
 *
 * Must be called after `document.fonts.ready`, otherwise the silhouette is of
 * the fallback face.
 */
export function sampleTextPoints(
  text,
  { count, width = 1200, lineHeight = 0.86, scale = 3.2, offset = [0, 0] } = {},
) {
  const lines = text
    .trim()
    .split(/\s+/)
    .map((line) => line.toUpperCase())
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return new Float32Array(count * 3)

  // Measure at a reference size, then scale to fill 92% of the raster. Cheaper
  // and far more reliable than guessing an average glyph advance.
  const font = (size) => `400 ${size}px "Instrument Serif", Georgia, serif`
  ctx.font = font(100)
  const widest = Math.max(...lines.map((line) => ctx.measureText(line).width))
  const fontSize = Math.round((100 * (width * 0.92)) / widest)
  const height = Math.round(fontSize * lineHeight * lines.length + fontSize * 0.4)

  canvas.width = width
  canvas.height = height

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = font(fontSize)

  lines.forEach((line, index) => {
    const y = height / 2 + (index - (lines.length - 1) / 2) * fontSize * lineHeight
    ctx.fillText(line, width / 2, y)
  })

  const { data } = ctx.getImageData(0, 0, width, height)
  const hits = []
  // Stride of 2px in each axis: plenty of candidates without reading every
  // pixel of a 1200px raster.
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      if (data[(y * width + x) * 4 + 3] > 128) hits.push(x, y)
    }
  }

  const positions = new Float32Array(count * 3)
  if (!hits.length) return positions

  const aspect = width / height

  for (let i = 0; i < count; i += 1) {
    const hit = (Math.floor(Math.random() * (hits.length / 2)) | 0) * 2
    // Jitter within the sampling cell so the silhouette edge stays soft.
    const x = (hits[hit] + Math.random() * 2) / width - 0.5
    const y = (hits[hit + 1] + Math.random() * 2) / height - 0.5

    positions[i * 3] = x * scale * aspect + offset[0]
    positions[i * 3 + 1] = -y * scale + offset[1]
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.35
  }

  return positions
}

export default sampleTextPoints
