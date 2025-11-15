import { useState } from 'react'
import React from 'react'
import Card from './components/Card.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const items = [
    "1 ajsbcksac",
    "2 ajsbcksac",
    "3 ajsbcksac"
  ]
  
  const [index, setIndex] = useState(0)
  const [offset, setOffset] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const startYRef = React.useRef(null)
  const cooldownRef = React.useRef(false)

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n))

  const goTo = (newIndex, dir) => {
    if (cooldownRef.current) return
    newIndex = clamp(newIndex, 0, items.length - 1)
    if (newIndex === index) return
    cooldownRef.current = true

    // start with new card off-screen (from dir), then slide it into place
    const height = window.innerHeight || 800
    setOffset(dir === 'up' ? height : -height)
    setOpacity(0)
    setIndex(newIndex)

    // allow render then animate into view
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOffset(0)
        setOpacity(1)
      })
    })

    setTimeout(() => {
      cooldownRef.current = false
    }, 450) // matches transition duration
  }

  const onTouchStart = (e) => {
    startYRef.current = e.touches && e.touches[0] ? e.touches[0].clientY : null
  }

  const onTouchEnd = (e) => {
    if (startYRef.current == null) return
    const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : null
    if (endY == null) return
    const dy = endY - startYRef.current
    const threshold = 50
    if (dy < -threshold) goTo(index + 1, 'up')
    else if (dy > threshold) goTo(index - 1, 'down')
    startYRef.current = null
  }

  const onWheel = (e) => {
    if (Math.abs(e.deltaY) < 30) return
    if (e.deltaY > 0) goTo(index + 1, 'up')
    else goTo(index - 1, 'down')
  }

  return (
    <div
      style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onWheel={onWheel}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto'
        }}
      >
        <div
          key={index}
          style={{
            transform: `translateY(${offset}px)`,
            transition: 'transform 380ms cubic-bezier(.2,.8,.2,1), opacity 300ms ease',
            opacity: opacity,
            width: '100%',
            maxWidth: 420,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Card description={items[index]} />
        </div>
      </div>
    </div>
  )
}

export default App
