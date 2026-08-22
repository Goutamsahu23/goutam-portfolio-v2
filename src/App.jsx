import { useState } from 'react'
import portfolioData from '../data.json'
import Grain from './components/chrome/Grain'
import Cursor from './components/chrome/Cursor'
import ScrollProgress from './components/chrome/ScrollProgress'
import Preloader from './components/chrome/Preloader'
import Nav from './components/chrome/Nav'
import Footer from './components/chrome/Footer'
import Hero from './sections/Hero'
import Statement from './sections/Statement'
import Work from './sections/Work'
import Trajectory from './sections/Trajectory'
import Stack from './sections/Stack'
import Credentials from './sections/Credentials'
import Contact from './sections/Contact'

function App() {
  // The hero holds its reveal until the cold open has lifted, so the two moves
  // read as one.
  const [introDone, setIntroDone] = useState(false)

  return (
    <>
      <Grain />
      <Cursor />
      <ScrollProgress />
      <Preloader name={portfolioData.personal.name} onComplete={() => setIntroDone(true)} />
      <Nav ready={introDone} />

      <main>
        <Hero introDone={introDone} />
        <Statement />
        <Stack />
        <Trajectory />
        <Work />
        <Credentials />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default App
