'use client'

import { ROOT_EGG_SEAL } from './rootEggSeal'

export type VaultContent = {
  title: string
  letter: string[]
  dossier: { k: string; v: string }[]
  log: string[]
}
export type RootPayload = { sealedAt: string; lines: string[]; vault?: VaultContent }

export const VAULT_KEY = 'azab-vault'

export function readVault(): (RootPayload & { vault: VaultContent }) | null {
  try {
    const raw = localStorage.getItem(VAULT_KEY)
    const p = raw ? (JSON.parse(raw) as RootPayload) : null
    return p && p.vault ? (p as RootPayload & { vault: VaultContent }) : null
  } catch {
    return null
  }
}

const ROOT_KEY = 'azab-root'

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0))

/**
 * Tries to open the sealed egg with whatever was typed. There is nothing to compare against:
 * a key is derived from the input and AES-GCM either authenticates or it doesn't.
 * Inputs shorter than 12 chars are skipped (the phrase is longer) so normal use stays instant.
 */
export async function tryOpenRoot(input: string): Promise<RootPayload | null> {
  const phrase = normalize(input)
  if (phrase.length < 12 || typeof crypto === 'undefined' || !crypto.subtle) return null
  try {
    const enc = new TextEncoder()
    const baseKey = await crypto.subtle.importKey('raw', enc.encode(phrase), 'PBKDF2', false, ['deriveKey'])
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: fromB64(ROOT_EGG_SEAL.salt), iterations: ROOT_EGG_SEAL.iterations, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    )
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: fromB64(ROOT_EGG_SEAL.iv) },
      key,
      fromB64(ROOT_EGG_SEAL.ciphertext)
    )
    const payload = JSON.parse(new TextDecoder().decode(plain)) as RootPayload
    try {
      localStorage.setItem(ROOT_KEY, '1')
      localStorage.setItem(VAULT_KEY, JSON.stringify(payload))
    } catch {
      /* ignore */
    }
    return payload
  } catch {
    return null // wrong phrase: indistinguishable from any other input
  }
}

export function hasRoot(): boolean {
  try {
    return localStorage.getItem(ROOT_KEY) === '1'
  } catch {
    return false
  }
}
