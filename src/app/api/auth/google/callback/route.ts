import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Google OAuth credentials not configured' },
      { status: 500 },
    )
  }

  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/auth/google/callback`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    return NextResponse.json(
      { error: 'Token exchange failed', details: err },
      { status: 500 },
    )
  }

  const tokens = await tokenRes.json()
  const refreshToken = tokens.refresh_token

  // Display the refresh token for the user to copy into .env.local
  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Google Calendar Connected</title></head>
    <body style="background:#0d0d0d;color:#00ff88;font-family:monospace;padding:40px;">
      <h2>Google Calendar Connected</h2>
      <p>Add this to your <code>.env.local</code> and restart the dev server:</p>
      <pre style="background:#1a1a1a;padding:16px;border-radius:8px;border:1px solid #333;user-select:all;">GOOGLE_REFRESH_TOKEN=${refreshToken || 'NOT_PROVIDED — re-run with prompt=consent'}</pre>
      <p style="color:#666;margin-top:20px;">You can close this tab.</p>
    </body>
    </html>
  `

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  })
}
