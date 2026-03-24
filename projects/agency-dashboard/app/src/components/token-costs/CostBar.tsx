'use client'

interface CostBarProps {
  cost: number
  maxCost: number
  budgetMonthly: number
}

function getBarColor(cost: number, budgetMonthly: number): string {
  if (budgetMonthly === 0) return 'bg-[var(--color-muted)]'
  const pct = cost / budgetMonthly
  if (pct > 0.8) return 'bg-[var(--color-signal)]'
  if (pct >= 0.5) return 'bg-yellow-400'
  return 'bg-green-500'
}

export function CostBar({ cost, maxCost, budgetMonthly }: CostBarProps) {
  const widthPct = maxCost > 0 ? Math.min((cost / maxCost) * 100, 100) : 0
  const barColor = getBarColor(cost, budgetMonthly)

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className="h-1.5 rounded-full bg-[var(--color-border)] flex-1 overflow-hidden"
        role="presentation"
        aria-hidden="true"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  )
}
