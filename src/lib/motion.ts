import { useEffect, useState } from 'react'

export const motionTokens = {
  duration: {
    instant: 0.08,
    fast: 0.15,
    normal: 0.22,
    slow: 0.4,
  },
  easing: {
    smooth: [0.22, 1, 0.36, 1] as [number, number, number, number],
    sharp: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
}

export const springs = {
  snappy: { type: 'spring', stiffness: 340, damping: 28 } as const,
  gentle: { type: 'spring', stiffness: 220, damping: 24 } as const,
  release: { type: 'spring', stiffness: 260, damping: 22, restDelta: 0.001 } as const,
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/** Enter/exit variants that collapse to an opacity-only fade under reduced motion. */
export function fadeRise(reduced: boolean, distance: number = motionTokens.distance.sm) {
  return {
    initial: { opacity: 0, y: reduced ? 0 : distance },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: reduced ? 0 : -distance / 2 },
  }
}
