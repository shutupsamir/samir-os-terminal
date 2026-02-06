import { NextRequest, NextResponse } from 'next/server'

const UPSTREAM = process.env.UPSTREAM_API_URL || 'http://localhost:3000'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = '/' + params.path.join('/')
  const search = request.nextUrl.searchParams.toString()
  const url = `${UPSTREAM}${path}${search ? `?${search}` : ''}`

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = '/' + params.path.join('/')
  const body = await request.text()

  const res = await fetch(`${UPSTREAM}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = '/' + params.path.join('/')
  const body = await request.text()

  const res = await fetch(`${UPSTREAM}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}
