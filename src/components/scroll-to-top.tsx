'use client'

import { ArrowUpIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export function ScrollToTop() {
  const [showScroll, setShowScroll] = useState(false)

  const checkScrollTop = useCallback(() => {
    if (!showScroll && window.scrollY > 500) {
      setShowScroll(true)
    } else if (showScroll && window.scrollY <= 500) {
      setShowScroll(false)
    }
  }, [showScroll])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop)
  }, [checkScrollTop])

  return (
    <button
      className={twMerge(
        'fixed bottom-4 right-4 hidden rounded-md bg-slate-500 p-2 shadow-sm hover:bg-slate-200 border border-slate-500 text-slate-100 hover:text-slate-500',
        showScroll && 'flex',
      )}
    >
      <ArrowUpIcon
        onClick={scrollTop}
        className="text-primary-red-foreground"
      />
    </button>
  )
}
