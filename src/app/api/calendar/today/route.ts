import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    return NextResponse.json(
      { error: 'Google Calendar not configured' },
      { status: 503 },
    )
  }

  // Exchange refresh token for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: 'Failed to refresh access token' },
      { status: 502 },
    )
  }

  const { access_token } = await tokenRes.json()

  // Fetch today's events
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay.getTime() + 86400000)

  const params = new URLSearchParams({
    timeMin: startOfDay.toISOString(),
    timeMax: endOfDay.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '20',
  })

  const calRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${access_token}` } },
  )

  if (!calRes.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 502 },
    )
  }

  const calData = await calRes.json()

  const events = (calData.items || []).map((item: Record<string, unknown>) => {
    const start = item.start as Record<string, string> | undefined
    const end = item.end as Record<string, string> | undefined
    const allDay = !!start?.date

    return {
      id: item.id as string,
      summary: (item.summary as string) || 'Untitled',
      start: start?.dateTime || start?.date || '',
      end: end?.dateTime || end?.date || '',
      allDay,
    }
  })

  return NextResponse.json(events, {
    headers: { 'Cache-Control': 'private, max-age=30' },
  })
}
