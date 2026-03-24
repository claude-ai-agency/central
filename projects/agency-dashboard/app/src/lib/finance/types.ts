export interface AgentBudget {
  name: string            // Agent name / commit prefix
  role: string            // Aus Tabellen-Zeile
  budgetMonthly: number   // EUR/month max
  currentMtd: number      // 0 wenn nicht vorhanden
}

export interface HiringBudget {
  totalMonthly: number        // Gesamt-Budget EUR
  agents: AgentBudget[]
  phase: number               // 1, 2, oder 3
  phaseThreshold: string      // z.B. "€5k MRR"
}

export interface ProjectBudgetEntry {
  projectId: string
  month: string               // "2026-03"
  budget: number              // EUR
  spent: number               // EUR
  remaining: number           // EUR
  status: 'ok' | 'warning' | 'critical'  // warning >80%, critical >95%
}
