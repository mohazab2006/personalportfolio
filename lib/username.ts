'use client'

import { useEffect, useState } from 'react'

/** The visitor's chosen terminal name (`login <name>` in Snaggy). Stored on this device only. */
const KEY = 'azab-username'
const EVENT = 'azab-username-change'

export function readUsername(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function writeUsername(name: string | null) {
  try {
    if (name) localStorage.setItem(KEY, name)
    else localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT))
}

export function useUsername(): string | null {
  const [name, setName] = useState<string | null>(null)
  useEffect(() => {
    setName(readUsername())
    const on = () => setName(readUsername())
    window.addEventListener(EVENT, on)
    return () => window.removeEventListener(EVENT, on)
  }, [])
  return name
}
