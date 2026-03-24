'use client'

import { useQuery } from '@tanstack/react-query'
import { AgentCard } from './AgentCard'
import type { AgentProfile } from '@/lib/agents/types'

async function fetchAgents(): Promise<AgentProfile[]> {
  const res = await fetch('/api/agents')
  if (!res.ok) throw new Error('Failed to fetch agents')
  return res.json() as Promise<AgentProfile[]>
}

export function OrgChart() {
  const { data: agents, isLoading, error, refetch } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-surface-2 border border-border rounded-lg p-4 animate-pulse h-24" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface-2 border border-signal/30 rounded-lg p-4 flex items-center justify-between gap-4">
        <p className="text-signal text-sm">Fehler beim Laden der Agent-Profile</p>
        <button
          onClick={() => void refetch()}
          className="shrink-0 text-xs font-mono text-white bg-signal/20 hover:bg-signal/30 border border-signal/40 rounded px-3 py-1.5 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  const active = agents?.filter(a => a.status === 'active') ?? []
  const pending = agents?.filter(a => a.status === 'pending-hire') ?? []
  const offline = agents?.filter(a => a.status === 'offline') ?? []

  return (
    <div className="space-y-6">
      {active.length > 0 && (
        <section>
          <h2 className="text-xs font-mono text-muted uppercase tracking-wider mb-3">
            Active — {active.length}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {active.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </section>
      )}

      {pending.length > 0 && (
        <section>
          <h2 className="text-xs font-mono text-muted uppercase tracking-wider mb-3">
            Pending Hire — {pending.length}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {pending.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </section>
      )}

      {offline.length > 0 && (
        <section>
          <h2 className="text-xs font-mono text-muted uppercase tracking-wider mb-3">
            Offline — {offline.length}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {offline.map(agent => <AgentCard key={agent.id} agent={agent} />)}
          </div>
        </section>
      )}
    </div>
  )
}
