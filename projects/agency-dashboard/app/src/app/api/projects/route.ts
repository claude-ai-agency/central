import { NextResponse } from 'next/server'
import { fetchAllProjects } from '@/lib/projects'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await fetchAllProjects()
  return NextResponse.json(projects)
}
