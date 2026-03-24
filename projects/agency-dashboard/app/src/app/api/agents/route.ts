import { NextResponse } from 'next/server'
import { fetchAllAgents } from '@/lib/agents'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const agents = await fetchAllAgents()
  return NextResponse.json(agents)
}
