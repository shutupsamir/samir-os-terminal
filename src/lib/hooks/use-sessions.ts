import useSWR from 'swr'
import { getSessions } from '@/lib/api'

export function useSessions(limit = 20) {
  return useSWR(['sessions', limit], () => getSessions(limit), {
    refreshInterval: 30_000,
    revalidateOnFocus: true,
  })
}
