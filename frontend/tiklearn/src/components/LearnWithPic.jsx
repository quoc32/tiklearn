import { useEffect, useState } from 'react'
import React from 'react'
import Card from './Card.jsx'
import QuizCard from './QuizCard.jsx'

function LearnWithPic() {
  const initialItems = [{first: true}]
  
  const [items, setItems] = useState(initialItems)
  const [index, setIndex] = useState(0)
  const [offset, setOffset] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const startYRef = React.useRef(null)
  const cooldownRef = React.useRef(false)
  const loadingRef = React.useRef(false) // prevent concurrent loads

  console.log("Items:", items)

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

  // load more helper
  const loadMore = async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    try {
      const da_co = items.map(item => item.id)
      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({"da_co": da_co})
      })
      if (!res.ok) throw new Error('Network response was not ok')
      const moreItem = await res.json()
      setItems(prevItems => [...prevItems, moreItem])

    } catch (err) {
      console.error('Failed to load more items:', err)
    } finally {
      loadingRef.current = false
    }
  }

  const onTouchStart = (e) => {
    startYRef.current = e.touches && e.touches[0] ? e.touches[0].clientY : null
  }

  const onWheel = (e) => {
    if (Math.abs(e.deltaY) < 30) return
    const nextIndex = e.deltaY > 0 ? clamp(index + 1, 0, items.length - 1) : clamp(index - 1, 0, items.length - 1)
    const dir = e.deltaY > 0 ? 'up' : 'down'
    goTo(nextIndex, dir)

    // load more if wheel moves to the last item
    if (nextIndex >= items.length - 1) {
      // Nễu đủ 4 item thì load 1 QuizCard
      // if (items.length % 4 === 0) {
      //   const title1 = items[(items.length - 1)].title;
      //   const title2 = items[(items.length - 2)].title;
      //   const title3 = items[(items.length - 3)].title;
      //   const title4 = items[(items.length - 4)].title;
      //   const quizItem = {quiz: true, items: [title1, title2, title3, title4]};
      //   setItems(prevItems => [...prevItems, quizItem])
      // }

      loadMore().catch(err => console.error(err))
    }
  }

  const onTouchEnd = async (e) => {
    if (startYRef.current == null) return
    const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : null
    if (endY == null) return
    const dy = endY - startYRef.current
    const threshold = 50

    // compute intended next index
    let nextIndex = index
    let dir = null
    if (dy < -threshold) {
      nextIndex = clamp(index + 1, 0, items.length - 1)
      dir = 'up'
    } else if (dy > threshold) {
      nextIndex = clamp(index - 1, 0, items.length - 1)
      dir = 'down'
    }

    // navigate if different
    if (dir) goTo(nextIndex, dir)
    startYRef.current = null

    // if we've reached the last item (or will), load more
    // use nextIndex since index state isn't updated synchronously
    if (nextIndex >= items.length - 1) {
      await loadMore()
    }
  }

  return (
    <div
      style={{ height: '90vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
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
          {
            items[index]?.quiz 
            ?
            <QuizCard items={items[index]?.items}/> 
            :
            <Card first={items[index]?.first ? true : false } title={items[index]?.word} description={items[index]?.description} image={items[index]?.image} />
          }
        </div>
      </div>
    </div>
  )
}

export default LearnWithPic
