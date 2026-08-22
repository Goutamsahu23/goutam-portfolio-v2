import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The faces that paint above the fold. Anything else (Cyrillic, Vietnamese,
// extended latin) can wait to be discovered through the stylesheet.
const CRITICAL_FACES = [
  'instrument-serif-latin-400-normal',
  'instrument-serif-latin-400-italic',
  'geist-latin-wght-normal',
  'geist-mono-latin-wght-normal',
]

/**
 * Fonts imported through @fontsource are only discoverable after the stylesheet
 * parses, which puts them a full round trip behind it — measured as ~315ms on
 * the critical chain. Filenames are content-hashed at build time, so the preload
 * tags have to be generated from the bundle rather than written by hand.
 */
function preloadCriticalFonts() {
  let base = '/'

  return {
    name: 'preload-critical-fonts',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml(html, ctx) {
      return Object.keys(ctx.bundle ?? {})
        .filter((file) => file.endsWith('.woff2') && CRITICAL_FACES.some((f) => file.includes(f)))
        .map((file) => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            href: `${base}${file}`,
            as: 'font',
            type: 'font/woff2',
            // Font fetches are always CORS-mode; without this the preload is
            // discarded and the file downloads twice.
            crossorigin: '',
          },
          injectTo: 'head-prepend',
        }))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadCriticalFonts()],
  build: {
    sourcemap: true,
    // Deliberately no manualChunks for three.js: giving it a named chunk makes
    // Vite treat it as a shared dependency and emit a <link rel="modulepreload">
    // in index.html, which downloads and compiles ~900 kB on every visit. Left
    // inside the lazily imported hero chunk, it is only fetched on demand.
  },
})
