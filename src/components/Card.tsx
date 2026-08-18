import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  animationDelay?: number
}

export function Card({ children, className = '', animationDelay }: CardProps) {
  return (
    <section className={`rounded-panel bg-surface shadow-card ${className}`} style={{ animationDelay: animationDelay === undefined ? undefined : `${animationDelay}ms` }}>
      {children}
    </section>
  )
}
