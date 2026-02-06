import useSWR from 'swr'
import { getReceipts } from '@/lib/api'

export function useReceipts(limit = 20) {
  return useSWR(['receipts', limit], () => getReceipts(limit), {
    refreshInterval: 10_000,
    revalidateOnFocus: true,
  })
}
