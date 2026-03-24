import { NextResponse } from 'next/server'
import { fetchHiringBudget } from '@/lib/finance'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const budget = await fetchHiringBudget()
  return NextResponse.json(budget)
}
