import { useState, useCallback, useEffect } from 'react'

const SCROLL_LOCK_CLASS = 'modal-open'
let scrollLockCount = 0

const lockScroll = () => {
  if (typeof document === 'undefined') return

  if (scrollLockCount === 0) {
    document.body.classList.add(SCROLL_LOCK_CLASS)
    document.documentElement.classList.add(SCROLL_LOCK_CLASS)
  }
  scrollLockCount += 1
}

const unlockScroll = () => {
  if (typeof document === 'undefined') return

  scrollLockCount = Math.max(scrollLockCount - 1, 0)
  if (scrollLockCount === 0) {
    document.body.classList.remove(SCROLL_LOCK_CLASS)
    document.documentElement.classList.remove(SCROLL_LOCK_CLASS)
  }
}

export const useScrollLock = (enabled: boolean = true) => {
  const [isLocked, setIsLocked] = useState(false)

  const lock = useCallback(() => {
    lockScroll()
    setIsLocked(true)
  }, [])

  const unlock = useCallback(() => {
    unlockScroll()
    setIsLocked(false)
  }, [])

  useEffect(() => {
    if (!enabled) return
    lock()
    return () => {
      unlock()
    }
  }, [enabled, lock, unlock])

  return { lockScroll: lock, unlockScroll: unlock, isLocked }
}
