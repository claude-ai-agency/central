import 'server-only'
import { listDirectory, getFileContent } from '@/lib/github'
import type { ProjectBrief, ProjectStatus, RiskLevel } from './types'

function extractField(content: string, field: string): string | null {
  const match = new RegExp(`\\*\\*${field}:\\*\\*\\s*(.+)`, 'i').exec(content)
  return match?.[1]?.trim() ?? null
}

function parseProgress(content: string): number {
  // Count checked vs total checkboxes
  const total = (content.match(/- \[[ x]\]/g) ?? []).length
  const checked = (content.match(/- \[x\]/gi) ?? []).length
  if (total === 0) return 0
  return Math.round((checked / total) * 100)
}

function parseStatus(content: string): ProjectStatus {
  const status = extractField(content, 'Status')?.toLowerCase() ?? ''
  if (status.includes('active') || status.includes('aktiv')) return 'active'
  if (status.includes('planning') || status.includes('planung')) return 'planning'
  if (status.includes('hold') || status.includes('pause')) return 'on-hold'
  if (status.includes('complet') || status.includes('fertig')) return 'completed'
  return 'planning'
}

function parseRisk(content: string): RiskLevel {
  const riskSection = /## Risiken[\s\S]*?(?=##|$)/.exec(content)?.[0] ?? ''
  const highCount = (riskSection.match(/\| Hoch \||\| High \|/gi) ?? []).length
  const medCount = (riskSection.match(/\| Mittel \||\| Medium \|/gi) ?? []).length
  if (highCount > 0) return 'high'
  if (medCount > 0) return 'medium'
  return 'low'
}

function parseBudget(content: string): number | null {
  const match = /\u20ac(\d+)\/Monat/.exec(content)
  return match?.[1] ? parseInt(match[1], 10) : null
}

export async function fetchAllProjects(): Promise<ProjectBrief[]> {
  const dirs = await listDirectory('projects')

  const projects = await Promise.all(
    dirs
      .filter(d => d.type === 'dir')
      .map(async (d): Promise<ProjectBrief | null> => {
        try {
          const content = await getFileContent(`projects/${d.name}/brief.md`)
          const h1Match = /^# (.+)/m.exec(content)
          const name = h1Match?.[1]?.replace(/^Projekt-Brief:\s*/i, '').trim() ?? d.name

          return {
            id: d.name,
            name,
            status: parseStatus(content),
            progress: parseProgress(content),
            deadline: extractField(content, 'MVP'),
            risk: parseRisk(content),
            tokenBudget: parseBudget(content),
            description: content.split('\n').find(l => l.length > 20 && !l.startsWith('#'))?.trim() ?? '',
            lastUpdated: null,
          }
        } catch {
          return null
        }
      })
  )

  return projects.filter((p): p is ProjectBrief => p !== null)
}
