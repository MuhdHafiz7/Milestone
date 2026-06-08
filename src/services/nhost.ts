import { NhostClient } from '@nhost/nhost-js'

const NHOST_SUBDOMAIN = import.meta.env.VITE_NHOST_SUBDOMAIN
const NHOST_REGION = import.meta.env.VITE_NHOST_REGION

export const nhost =
  NHOST_SUBDOMAIN
    ? new NhostClient({ subdomain: NHOST_SUBDOMAIN, region: NHOST_REGION })
    : null

export function assertNhost() {
  if (!nhost) {
    throw new Error('Nhost is not configured. Set VITE_NHOST_SUBDOMAIN (and optionally VITE_NHOST_REGION).')
  }

  return nhost
}
