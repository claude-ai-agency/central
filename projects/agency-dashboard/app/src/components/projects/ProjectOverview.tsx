'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import type { ProjectBrief, ProjectStatus } from '@/lib/projects/types'
import { ProjectCard } from './ProjectCard'

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchProjects(): Promise<ProjectBrief[]> {
  const res = await fetch('/api/projects')
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json() as Promise<ProjectBrief[]>
}

// ── Filter pills ──────────────────────────────────────────────────────────────

type FilterValue = 'all' | ProjectStatus

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'all',      label: 'All' },
  { value: 'active',   label: 'Active' },
  { value: 'planning', label: 'Planning' },
  { value: 'on-hold',  label: 'On Hold' },
]

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg p-4 animate-pulse flex flex-col gap-3"
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-[var(--color-border)] rounded w-3/4" />
          <div className="h-3 bg-[var(--color-border)] rounded w-full" />
          <div className="h-3 bg-[var(--color-border)] rounded w-2/3" />
        </div>
        <div className="h-5 w-12 bg-[var(--color-border)] rounded" />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <div className="h-3 bg-[var(--color-border)] rounded w-12" />
          <div className="h-3 bg-[var(--color-border)] rounded w-8" />
        </div>
        <div className="h-1.5 bg-[var(--color-border)] rounded-full" />
      </div>
      <div className="flex justify-between pt-1 border-t border-[var(--color-border)]">
        <div className="h-4 w-16 bg-[var(--color-border)] rounded" />
        <div className="h-4 w-20 bg-[var(--color-border)] rounded" />
      </div>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectOverview() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>('all')

  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <FilterPills active={activeFilter} onChange={setActiveFilter} disabled />
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-label="Loading projects"
          aria-busy="true"
        >
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[var(--color-surface-2)] border border-[var(--color-signal)]/30 rounded-lg p-4 flex items-center justify-between gap-4">
        <p className="text-[var(--color-signal)] text-sm">Fehler beim Laden der Projekte</p>
        <button
          onClick={() => void refetch()}
          className="shrink-0 text-xs font-mono text-white bg-[var(--color-signal)]/20 hover:bg-[var(--color-signal)]/30 border border-[var(--color-signal)]/40 rounded px-3 py-1.5 transition-colors"
          aria-label="Retry loading projects"
        >
          Retry
        </button>
      </div>
    )
  }

  const filtered =
    activeFilter === 'all'
      ? (projects ?? [])
      : (projects ?? []).filter(p => p.status === activeFilter)

  return (
    <div className="space-y-4">
      <FilterPills active={activeFilter} onChange={setActiveFilter} />

      {filtered.length === 0 ? (
        <div
          className="bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-lg p-8 text-center"
          role="status"
          aria-label="No projects found"
        >
          <p className="text-[var(--color-muted)] text-sm">
            {projects?.length === 0
              ? 'Noch keine Projekte vorhanden.'
              : 'Keine Projekte in diesem Status.'}
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          aria-label={`${filtered.length} project${filtered.length === 1 ? '' : 's'}`}
        >
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── FilterPills sub-component ─────────────────────────────────────────────────

interface FilterPillsProps {
  active: FilterValue
  onChange: (value: FilterValue) => void
  disabled?: boolean
}

function FilterPills({ active, onChange, disabled = false }: FilterPillsProps) {
  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="group"
      aria-label="Filter projects by status"
    >
      {FILTERS.map(filter => {
        const isActive = active === filter.value
        return (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            disabled={disabled}
            aria-pressed={isActive}
            aria-label={`Filter: ${filter.label}`}
            className={`text-xs font-mono px-3 py-1.5 rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              isActive
                ? 'bg-[var(--color-signal)]/20 border-[var(--color-signal)]/60 text-white'
                : 'bg-transparent border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-signal)]/40 hover:text-white'
            }`}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
