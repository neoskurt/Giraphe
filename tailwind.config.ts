import type { Config } from 'tailwindcss'

function withAlpha(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`
}

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: withAlpha('--color-cream'),
        surface: withAlpha('--color-surface'),
        sunken: withAlpha('--color-sunken'),
        ink: withAlpha('--color-ink'),
        'ink-secondary': withAlpha('--color-ink-secondary'),
        'ink-muted': withAlpha('--color-ink-muted'),
        line: withAlpha('--color-line'),
        terracotta: withAlpha('--color-terracotta'),
        'terracotta-hover': withAlpha('--color-terracotta-hover'),
        'terracotta-soft': withAlpha('--color-terracotta-soft'),
        danger: withAlpha('--color-danger'),
        'danger-soft': withAlpha('--color-danger-soft'),
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"Public Sans Variable"', '"Public Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display-xl': ['2.125rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-lg': ['1.625rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        heading: ['1.125rem', { lineHeight: '1.3' }],
        eyebrow: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
      },
      boxShadow: {
        sm: '0 1px 2px rgb(var(--color-ink) / 0.06)',
        card: '0 1px 3px rgb(var(--color-ink) / 0.08), 0 1px 1px rgb(var(--color-ink) / 0.04)',
        panel: '0 12px 32px rgb(var(--color-ink) / 0.14), 0 2px 8px rgb(var(--color-ink) / 0.08)',
        lifted: '0 18px 40px rgb(var(--color-ink) / 0.20), 0 4px 12px rgb(var(--color-ink) / 0.10)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        instant: '80ms',
        fast: '150ms',
        normal: '220ms',
        slow: '400ms',
      },
      backgroundImage: {
        reticulate:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='104' viewBox='0 0 120 104'%3E%3Cpath d='M60 0 120 34.6V86.6L60 104 0 86.6V34.6Z' fill='none' stroke='%233D2A18' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E\")",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': withAlpha('--color-ink-secondary'),
            '--tw-prose-headings': withAlpha('--color-ink'),
            '--tw-prose-bold': withAlpha('--color-ink'),
            '--tw-prose-links': withAlpha('--color-terracotta'),
            '--tw-prose-bullets': withAlpha('--color-terracotta'),
            '--tw-prose-code': withAlpha('--color-ink'),
            '--tw-prose-invert-body': withAlpha('--color-ink-secondary'),
            '--tw-prose-invert-headings': withAlpha('--color-ink'),
            '--tw-prose-invert-bold': withAlpha('--color-ink'),
            '--tw-prose-invert-links': withAlpha('--color-terracotta'),
            '--tw-prose-invert-bullets': withAlpha('--color-terracotta'),
            '--tw-prose-invert-code': withAlpha('--color-ink'),
            fontFamily: 'inherit',
            h1: { fontFamily: '"Fraunces Variable", serif' },
            h2: { fontFamily: '"Fraunces Variable", serif' },
            h3: { fontFamily: '"Fraunces Variable", serif' },
            maxWidth: 'none',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
