import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function proxy(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: []
}