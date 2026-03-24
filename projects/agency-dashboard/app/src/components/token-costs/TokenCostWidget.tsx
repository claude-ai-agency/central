'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import type { HiringBudget, AgentBudget } from '@/lib/finance/types'
import { CostBar } from './CostBar'

type TabId = 'mtd' | 'week' | 'today'

interface Tab {
  id: TabId
  label: string
  estimated: boolean
}

const TABS: Tab[] = [
  { id: 'mtd', label: 'MTD', estimated: false },
  { id: 'week', label: 'Week', estimated: true },
  { id: 'today', label: 'Today', estimated: true },
]

function getCostForTab(agent: AgentBudget, tab: TabId): number {
  if (tab === 'mtd') return agent.currentMtd
  if (tab === 'week') return agent.currentMtd / 4
  return agent.currentMtd / 30
}

function formatEur(amount: number): string {
  return `€${amount.toFixed(2)}`
}

async function fetchBudget(): Promise<HiringBudget> {
  const res = await fetch('/api/finance/budget')
  if (!res.ok) throw new Error('Failed to fetch finance budget')
  return res.json() as Promise<HiringBudget>
}

interface AgentRowProps {
  agent: AgentBudget
  tab: TabId
  totalCost: number
  maxCost: number
  isOverThreshold: boolean
}

function AgentRow({ agent, tab, totalCost, maxCost, isOverThreshold }: AgentRowProps) {
  const cost = getCostForTab(agent, tab)
  const pctOfTotal = totalCost > 0 ? (cost / totalCost) * 100 : 0
  const pctOfBudget = agent.budgetMonthly > 0 ? agent.currentMtd / agent.budgetMonthly : 0
  const isOverBudgetThreshold = pctOfBudget > 0.3

  return (
    <tr
      className={`border-b border-[var(--color-border)] last:border-0 ${
        isOverBudgetThreshold
          ? 'text-[var(--color-signal)]'
          : 'text-white'
      }`}
    >
      <td className="py-2.5 pr-4">
        <span className="font-mono text-xs text-[var(--color-signal)]">{agent.name}</span>
        <span className="block text-xs text-[var(--color-muted)] mt-0.5">{agent.role}</span>
      </td>
      <td className="py-2.5 pr-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm tabular-nums">
              {formatEur(cost)}
            </span>
            {isOverBudgetThreshold && (
              <span className="inline-flex items-center rounded px-1 py-0 bg-[var(--color-signal)]/10 text-[var(--color-signal)] text-[10px] font-mono border border-[var(--color-signal)]/20">
                &gt;30%
              </span>
            )}
          </div>
          <CostBar cost={cost} maxCost={maxCost} budgetMonthly={agent.budgetMonthly} />
        </div>
      </td>
      <td className="py-2.5 text-right">
        <span className="font-mono text-xs text-[var(--color-muted)] tabular-nums">
          {pctOfTotal.toFixed(1)}%
        </span>
      </td>
      <td className="py-2.5 pl-4 text-right">
        <span className="text-xs text-[var(--color-muted)] tabular-nums">
          {formatEur(agent.budgetMonthly)}/mo
        </span>
      </td>
    </tr>
  )
}

export function TokenCostWidget() {
  const [activeTab, setActiveTab] = useState<TabId>('mtd')

  const { data: budget, isLoading, error, refetch } = useQuery({
    queryKey: ['finance', 'budget'],
    queryFn: fetchBudget,
    staleTime: 10 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 space-y-3">
        <div className="h-4 bg-[var(--color-surface-2)] rounded animate-pulse w-32" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-[var(--color-surface-2)] rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[var(--color-surface)] border border-[var(--color-signal)]/30 rounded-lg p-4 flex items-center justify-between gap-4">
        <p className="text-[var(--color-signal)] text-sm">Fehler beim Laden der Kostendaten</p>
        <button
          onClick={() => void refetch()}
          className="shrink-0 text-xs font-mono text-white bg-[var(--color-signal)]/20 hover:bg-[var(--color-signal)]/30 border border-[var(--color-signal)]/40 rounded px-3 py-1.5 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!budget) return null

  const sortedAgents = [...budget.agents].sort((a, b) => {
    return getCostForTab(b, activeTab) - getCostForTab(a, activeTab)
  })

  const totalCost = sortedAgents.reduce(
    (sum, agent) => sum + getCostForTab(agent, activeTab),
    0,
  )

  const maxCost = sortedAgents.reduce(
    (max, agent) => Math.max(max, getCostForTab(agent, activeTab)),
    0,
  )

  const mtdTotal = budget.agents.reduce((sum, a) => sum + a.currentMtd, 0)
  const mtdPct = budget.totalMonthly > 0 ? mtdTotal / budget.totalMonthly : 0
  const showWarning = mtdPct >= 0.8

  const activeTabDef = TABS.find(t => t.id === activeTab)

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[var(--color-border)]">
        <h3 className="text-sm font-semibold text-white">Token Costs</h3>
        <span className="text-xs text-[var(--color-muted)] font-mono">
          Cap: {formatEur(budget.totalMonthly)}/mo
        </span>
      </div>

      {/* Warning Banner */}
      {showWarning && (
        <div
          role="alert"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-signal)]/10 border-b border-[var(--color-signal)]/30"
        >
          <span className="text-[var(--color-signal)] text-xs font-mono">⚠</span>
          <p className="text-[var(--color-signal)] text-xs">
            MTD spend at {(mtdPct * 100).toFixed(0)}% of monthly budget cap
          </p>
        </div>
      )}

      {/* Tab Switcher */}
      <div
        role="tablist"
        aria-label="Time period"
        className="flex border-b border-[var(--color-border)] px-4"
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 py-2.5 mr-4 text-xs font-mono border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[var(--color-signal)] text-white'
                : 'border-transparent text-[var(--color-muted)] hover:text-white'
            }`}
          >
            {tab.label}
            {tab.estimated && (
              <span className="text-[10px] text-[var(--color-muted)]">(est.)</span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div
        id={`tabpanel-${activeTab}`}
        role="tabpanel"
        aria-label={`${activeTabDef?.label ?? activeTab} costs`}
        className="px-4 pb-4"
      >
        {activeTabDef?.estimated && (
          <p className="text-[10px] text-[var(--color-muted)] pt-2 pb-1 font-mono">
            * Estimated from MTD — live per-period data not yet available
          </p>
        )}

        <table role="table" className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th
                scope="col"
                className="py-2 pr-4 text-left text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider"
              >
                Agent
              </th>
              <th
                scope="col"
                className="py-2 pr-4 text-left text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider"
              >
                Cost
              </th>
              <th
                scope="col"
                className="py-2 text-right text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider"
              >
                % Total
              </th>
              <th
                scope="col"
                className="py-2 pl-4 text-right text-[10px] font-mono text-[var(--color-muted)] uppercase tracking-wider"
              >
                Budget
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAgents.map(agent => {
              const pctOfBudget = agent.budgetMonthly > 0 ? agent.currentMtd / agent.budgetMonthly : 0
              return (
                <AgentRow
                  key={agent.name}
                  agent={agent}
                  tab={activeTab}
                  totalCost={totalCost}
                  maxCost={maxCost}
                  isOverThreshold={pctOfBudget > 0.3}
                />
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-[var(--color-border)]">
              <td className="py-2.5 pr-4">
                <span className="text-xs font-semibold text-white">Total</span>
              </td>
              <td className="py-2.5 pr-4">
                <span className="font-mono text-sm font-semibold text-white tabular-nums">
                  {formatEur(totalCost)}
                </span>
              </td>
              <td className="py-2.5 text-right">
                <span className="font-mono text-xs text-[var(--color-muted)] tabular-nums">100%</span>
              </td>
              <td className="py-2.5 pl-4 text-right">
                <span className="text-xs text-[var(--color-muted)] tabular-nums">
                  {formatEur(budget.totalMonthly)}/mo
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
