import { NextResponse } from 'next/server'
import { fetchProjectBudgets } from '@/lib/finance'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const budgets = await fetchProjectBudgets()
  return NextResponse.json(budgets)
}
