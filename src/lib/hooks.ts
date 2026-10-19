import { useEffect, useRef, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

/** Anima un número de 0 al valor final (900 ms). Sin animación con prefers-reduced-motion. */
export function useCountUp(target: number, duration = 900): number {
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(reduced ? target : 0)
  useEffect(() => {
    if (reduced || !Number.isFinite(target)) {
      setValue(target)
      return undefined
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setValue(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, reduced])
  return value
}

/** true un instante después del montaje: sirve para animar anchos y arcos desde 0. */
export function useMounted(): boolean {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOn(true))
    return () => cancelAnimationFrame(frame)
  }, [])
  return on
}

export function useElementWidth<T extends HTMLElement>(fallback = 800) {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(fallback)
  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    const update = () => setWidth(element.clientWidth || fallback)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [fallback])
  return { ref, width }
}

export function useStoredFlag(key: string, initial: boolean): [boolean, (next: boolean) => void] {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored === null ? initial : stored === '1'
    } catch {
      return initial
    }
  })
  const update = (next: boolean) => {
    setValue(next)
    try {
      window.localStorage.setItem(key, next ? '1' : '0')
    } catch {
      /* almacenamiento no disponible */
    }
  }
  return [value, update]
}
