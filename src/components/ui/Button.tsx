import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-terracotta text-cream hover:bg-terracotta-hover focus-visible:outline-terracotta disabled:bg-ink-muted/40 disabled:text-ink-muted shadow-sm',
  secondary:
    'bg-surface text-ink border border-line hover:border-terracotta/50 hover:bg-terracotta-soft/60 focus-visible:outline-terracotta',
  ghost:
    'bg-transparent text-ink-secondary hover:bg-sunken hover:text-ink focus-visible:outline-terracotta',
  danger:
    'bg-danger text-cream hover:brightness-95 focus-visible:outline-danger disabled:bg-ink-muted/40 disabled:text-ink-muted shadow-sm',
}

const SIZES: Record<Size, string> = {
  sm: 'px-2.5 py-1.5 text-[13px] gap-1.5',
  md: 'px-3.5 py-2 text-sm gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded font-medium tracking-tight transition-[background-color,border-color,color,transform] duration-fast ease-smooth active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:active:scale-100',
          VARIANTS[variant],
          SIZES[size],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
