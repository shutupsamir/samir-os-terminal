import useSWR from 'swr'
import { getDashboard } from '@/lib/api'

export function useDashboard() {
  return useSWR('dashboard', getDashboard, {
    refreshInterval: 15_000,
    revalidateOnFocus: true,
    dedupingInterval: 5_000,
  })
}
