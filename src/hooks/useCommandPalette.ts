import { useState, useCallback } from 'react'

export function useCommandPalette() {
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  const setOpenSafe = useCallback((value: boolean) => {
    setOpen(value)
  }, [])

  return {
    open,
    toggle,
    setOpen: setOpenSafe,
  }
}
