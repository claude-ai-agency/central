export type AgentStatus = 'active' | 'pending-hire' | 'offline'

export interface AgentProfile {
  id: string          // kebab-case aus Dateiname
  role: string        // aus YAML frontmatter
  status: AgentStatus
  reportTo: string
  budgetMonthly: string
  commitPrefix: string
  githubTeam: string
  skills: string[]
  hiredDate: string | null
  owns: string[]
}
