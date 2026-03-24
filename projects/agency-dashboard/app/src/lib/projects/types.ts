export type ProjectStatus = 'active' | 'planning' | 'on-hold' | 'completed'
export type RiskLevel = 'low' | 'medium' | 'high'

export interface ProjectBrief {
  id: string           // Verzeichnisname
  name: string         // Lesbarer Name aus brief.md H1
  status: ProjectStatus
  progress: number     // 0-100
  deadline: string | null
  risk: RiskLevel
  tokenBudget: number | null  // EUR/Monat
  description: string
  lastUpdated: string | null
}
