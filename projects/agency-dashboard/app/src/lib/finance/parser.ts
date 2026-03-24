import 'server-only'
import { getFileContent } from '@/lib/github'
import type { HiringBudget, AgentBudget, ProjectBudgetEntry } from './types'

function parseEur(str: string): number {
  const match = /€(\d+(?:\.\d+)?)/.exec(str)
  return match?.[1] ? parseFloat(match[1]) : 0
}

function parseMarkdownTable(content: string): string[][] {
  const rows: string[][] = []
  for (const line of content.split('\n')) {
    if (!line.startsWith('|') || line.includes('---')) continue
    const cells = line.split('|').slice(1, -1).map(c => c.trim())
    if (cells.length > 0) rows.push(cells)
  }
  return rows
}

export async function fetchHiringBudget(): Promise<HiringBudget> {
  const content = await getFileContent('_finance/hiring-budget.md')

  const totalMatch = /\*\*Gesamt:\*\*\s*€(\d+)\/Monat/.exec(content)
  const total = totalMatch?.[1] ? parseInt(totalMatch[1], 10) : 300

  const phaseMatch = /Phase (\d+) \(jetzt\)/.exec(content)
  const phase = phaseMatch?.[1] ? parseInt(phaseMatch[1], 10) : 1

  const phaseThresholdMatch = /Phase 2 \(ab ([^)]+)\)/.exec(content)
  const phaseThreshold = phaseThresholdMatch?.[1] ?? '€5k MRR'

  const rows = parseMarkdownTable(content)
  const agents: AgentBudget[] = rows
    .slice(1) // Skip header
    .map((cells): AgentBudget | null => {
      if (!cells[0] || !cells[1]) return null
      return {
        role: cells[0],
        maxPerMonth: parseEur(cells[1] ?? ''),
        currentMtd: 0,
      }
    })
    .filter((a): a is AgentBudget => a !== null)

  return { totalMonthly: total, agents, phase, phaseThreshold }
}

export async function fetchProjectBudgets(): Promise<ProjectBudgetEntry[]> {
  const content = await getFileContent('_finance/projects.md')

  const entries: ProjectBudgetEntry[] = []
  const sections = content.split(/^### /m).slice(1)

  for (const section of sections) {
    const projectId = section.split('\n')[0]?.trim() ?? ''
    const rows = parseMarkdownTable(section)

    for (const cells of rows.slice(1)) {
      if (!cells[0] || cells[0] === '\u2014') continue
      const budget = parseEur(cells[1] ?? '')
      const spent = parseEur(cells[2] ?? '')
      const pct = budget > 0 ? spent / budget : 0

      entries.push({
        projectId,
        month: cells[0],
        budget,
        spent,
        remaining: budget - spent,
        status: pct >= 0.95 ? 'critical' : pct >= 0.80 ? 'warning' : 'ok',
      })
    }
  }

  return entries
}
