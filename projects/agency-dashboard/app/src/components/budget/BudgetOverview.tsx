'use client'

import { useQuery } from '@tanstack/react-query'

import type { HiringBudget } from '@/lib/finance/types'

import { BudgetBar } from './BudgetBar'

function SkeletonBar() {
  return (
    <div className="space-y-1 animate-pulse">
      <div className="flex justify-between">
        <div className="h-3 w-24 bg-surface-2 rounded" />
        <div className="h-3 w-8 bg-surface-2 rounded" />
      </div>
      <div className="h-1.5 w-full bg-surface-2 rounded-full" />
    </div>
  )
}

export function BudgetOverview() {
  const { data, isLoading, isError, refetch } = useQuery<HiringBudget>({
    queryKey: ['finance', 'budget'],
    queryFn: () => fetch('/api/finance/budget').then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json() as Promise<HiringBudget>
    }),
    staleTime: 10 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
        <div className="h-4 w-40 bg-surface-2 rounded animate-pulse" />
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBar key={i} />
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="bg-surface border border-[var(--color-signal)]/40 rounded-lg p-4">
        <p className="text-sm text-[var(--color-signal)] mb-3">Failed to load budget data.</p>
        <button
          onClick={() => void refetch()}
          className="text-xs font-mono border border-border text-muted hover:text-white hover:border-muted
            rounded px-3 py-1.5 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  const totalSpent = data.agents.reduce((sum, a) => sum + a.currentMtd, 0)
  const totalPct =
    data.totalMonthly > 0
      ? Math.round((totalSpent / data.totalMonthly) * 100)
      : 0

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">Agent Budgets</h2>
        <span className="text-xs font-mono text-muted">
          <span className="text-white">{totalSpent.toFixed(0)}€</span>
          {' / '}
          {data.totalMonthly.toFixed(0)}€ total
          {' '}
          <span className={totalPct > 80 ? 'text-[var(--color-signal)]' : 'text-muted'}>
            ({totalPct}%)
          </span>
        </span>
      </div>

      <div className="space-y-4">
        {data.agents.map(agent => (
          <BudgetBar
            key={agent.name}
            agent={agent}
            totalBudget={data.totalMonthly}
          />
        ))}
      </div>
    </div>
  )
}
