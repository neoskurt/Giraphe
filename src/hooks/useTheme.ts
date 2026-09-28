import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

export function useThemeEffect() {
  const theme = useStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])
}
