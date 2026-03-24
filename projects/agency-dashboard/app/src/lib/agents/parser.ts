import 'server-only'
import { listDirectory, getFileContent } from '@/lib/github'
import type { AgentProfile, AgentStatus } from './types'

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = /^---\n([\s\S]*?)\n---/.exec(content)
  if (!match?.[1]) return {}

  const result: Record<string, unknown> = {}
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    const val = line.slice(colonIdx + 1).trim()

    if (val.startsWith('[') && val.endsWith(']')) {
      result[key] = val
        .slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
    } else {
      result[key] = val.replace(/^['"]|['"]$/g, '')
    }
  }
  return result
}

function toAgentStatus(raw: unknown): AgentStatus {
  if (raw === 'active') return 'active'
  if (raw === 'pending-hire') return 'pending-hire'
  return 'offline'
}

export async function fetchAllAgents(): Promise<AgentProfile[]> {
  const files = await listDirectory('_hr/agents')

  const agents = await Promise.all(
    files
      .filter(f => f.type === 'file' && f.name.endsWith('.md'))
      .map(async (f): Promise<AgentProfile | null> => {
        try {
          const content = await getFileContent(`_hr/agents/${f.name}`)
          const fm = parseFrontmatter(content)

          return {
            id: f.name.replace('.md', ''),
            role: String(fm['role'] ?? f.name),
            status: toAgentStatus(fm['status']),
            reportTo: String(fm['reports_to'] ?? ''),
            budgetMonthly: String(fm['budget_monthly'] ?? ''),
            commitPrefix: String(fm['commit_prefix'] ?? ''),
            githubTeam: String(fm['github_team'] ?? ''),
            skills: Array.isArray(fm['skills']) ? (fm['skills'] as string[]) : [],
            hiredDate: fm['hired'] ? String(fm['hired']) : null,
            owns: Array.isArray(fm['owns']) ? (fm['owns'] as string[]) : [],
          }
        } catch {
          return null
        }
      })
  )

  return agents.filter((a): a is AgentProfile => a !== null)
}
