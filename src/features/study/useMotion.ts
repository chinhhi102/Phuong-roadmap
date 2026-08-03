import { useEffect, useState } from 'react'
import { useStudyStore } from '@/store/studyStore'

/** Live subscription to the OS "reduce motion" accessibility preference. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Decorative motion plays only when the user opted in AND hasn't asked to reduce motion. */
export function useAnimations(): boolean {
  const animationsOn = useStudyStore((s) => s.animationsOn)
  const reduced = usePrefersReducedMotion()
  return animationsOn && !reduced
}
