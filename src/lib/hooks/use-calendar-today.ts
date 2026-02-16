import useSWR from 'swr'

export interface CalendarEvent {
  id: string
  summary: string
  start: string // ISO or time string
  end: string
  allDay: boolean
}

async function fetcher(url: string): Promise<CalendarEvent[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Calendar fetch failed')
  return res.json()
}

export function useCalendarToday() {
  const { data, error, isLoading } = useSWR<CalendarEvent[]>(
    '/api/calendar/today',
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: false },
  )

  return {
    events: data || [],
    isLoading,
    isError: !!error,
    isConnected: !error,
  }
}
