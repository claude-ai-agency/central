'use client'

import type { AgentProfile } from '@/lib/agents/types'

import { StatusBadge } from '@/components/status-badge'

function parseBudgetPercent(budgetMonthly: string): number | null {
  // Expects formats like "€200/mo (20%)" or "20%" — extract the % value
  const match = /(\d+(?:\.\d+)?)\s*%/.exec(budgetMonthly)
  if (match) return parseFloat(match[1])
  return null
}

interface AgentCardProps {
  agent: AgentProfile
}

export function AgentCard({ agent }: AgentCardProps) {
  const budgetPercent = parseBudgetPercent(agent.budgetMonthly)
  const isOverBudget = budgetPercent !== null && budgetPercent > 30
  const borderClass = isOverBudget
    ? 'border-signal/60 hover:border-signal'
    : 'border-border hover:border-signal'

  return (
    <div
      className={`bg-surface-2 border ${borderClass} rounded-lg p-4 transition-colors`}
      title={isOverBudget ? `Budget-Anteil ${budgetPercent}% — über 30% Schwelle` : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-xs text-signal truncate">{agent.commitPrefix}</p>
          <h3 className="text-sm font-semibold text-white mt-0.5 truncate">{agent.role}</h3>
          <p className="text-xs text-muted mt-0.5">→ {agent.reportTo}</p>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {agent.budgetMonthly && (
        <p className={`text-xs mt-3 pt-3 border-t border-border ${isOverBudget ? 'text-signal' : 'text-muted'}`}>
          Budget:{' '}
          <span className={isOverBudget ? 'font-semibold' : 'text-white'}>
            {agent.budgetMonthly}
          </span>
          {isOverBudget && (
            <span className="ml-1.5 inline-flex items-center rounded px-1 py-0 bg-signal/10 text-signal text-[10px] font-mono">
              &gt;30%
            </span>
          )}
        </p>
      )}
    </div>
  )
}
