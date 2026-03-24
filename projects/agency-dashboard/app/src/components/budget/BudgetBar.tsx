'use client'

import type { AgentBudget } from '@/lib/finance/types'

interface BudgetBarProps {
  agent: AgentBudget
  totalBudget: number
}

export function BudgetBar({ agent, totalBudget }: BudgetBarProps) {
  const ownPercent =
    agent.budgetMonthly > 0
      ? Math.min(100, Math.round((agent.currentMtd / agent.budgetMonthly) * 100))
      : 0

  const totalSharePercent =
    totalBudget > 0 ? (agent.currentMtd / totalBudget) * 100 : 0

  const isHighShare = totalSharePercent > 30

  const tooltipText = `${agent.currentMtd.toFixed(0)}€ / ${agent.budgetMonthly.toFixed(0)}€`

  return (
    <div className="group relative">
      <div className="flex items-center justify-between mb-1">
        <div className="min-w-0 flex-1">
          <span className="font-mono text-xs text-signal truncate block">{agent.name}</span>
          <span className="text-xs text-muted truncate block">{agent.role}</span>
        </div>
        <span
          className={`text-xs font-mono ml-3 shrink-0 ${isHighShare ? 'text-signal font-semibold' : 'text-muted'}`}
        >
          {ownPercent}%
        </span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={ownPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${agent.name} budget: ${tooltipText}`}
        title={tooltipText}
        className={`relative h-1.5 w-full rounded-full bg-surface-2 border ${
          isHighShare ? 'border-[var(--color-signal)]/40' : 'border-border'
        } overflow-hidden cursor-default`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isHighShare ? 'bg-[var(--color-signal)]' : 'bg-muted'
          }`}
          style={{ width: `${ownPercent}%` }}
        />
      </div>

      {/* Hover tooltip */}
      <div
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10
          hidden group-hover:block
          bg-surface-2 border border-border rounded px-2 py-1
          text-xs font-mono text-white whitespace-nowrap shadow-lg"
      >
        {tooltipText}
        {isHighShare && (
          <span className="ml-1.5 text-[var(--color-signal)]">&gt;30% of pool</span>
        )}
      </div>
    </div>
  )
}
