import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import { MotionPreferenceProvider } from './lib/motionPreference'
import SmoothScroll from './lib/SmoothScroll'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionPreferenceProvider>
      {/* `reducedMotion="user"` makes Framer drop transforms and keep opacity
          for every animation in the tree; useMotionPreference handles the rest. */}
      <MotionConfig reducedMotion="user">
        <SmoothScroll>
          <App />
        </SmoothScroll>
      </MotionConfig>
    </MotionPreferenceProvider>
  </StrictMode>,
)
