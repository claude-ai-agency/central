'use client'

import type { ProjectBrief, ProjectStatus, RiskLevel } from '@/lib/projects/types'

// ── Progress bar ──────────────────────────────────────────────────────────────

function progressColor(progress: number): string {
  if (progress > 90) return 'bg-[var(--color-signal)]'
  if (progress > 70) return 'bg-yellow-400'
  return 'bg-green-500'
}

// ── Status chip ───────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<ProjectStatus, { label: string; className: string }> = {
  active:    { label: 'Active',    className: 'bg-green-500/15 text-green-400 border-green-500/30' },
  planning:  { label: 'Planning',  className: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  'on-hold': { label: 'On Hold',   className: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30' },
  completed: { label: 'Completed', className: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
}

// ── Risk badge ────────────────────────────────────────────────────────────────

const RISK_CONFIG: Record<RiskLevel, { label: string; className: string; ariaLabel: string }> = {
  low:    { label: 'Low',    className: 'bg-green-500/15 text-green-400',                    ariaLabel: 'Risk level: low' },
  medium: { label: 'Medium', className: 'bg-yellow-400/15 text-yellow-400',                  ariaLabel: 'Risk level: medium' },
  high:   { label: 'High',   className: 'bg-[var(--color-signal)]/15 text-[var(--color-signal)]', ariaLabel: 'Risk level: high' },
}

// ── Deadline helper ───────────────────────────────────────────────────────────

function formatDeadline(deadline: string): { label: string; overdue: boolean } {
  const now = new Date()
  const due = new Date(deadline)
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { label: 'OVERDUE', overdue: true }
  if (diffDays === 0) return { label: 'Due today', overdue: false }
  return { label: `${diffDays}d left`, overdue: false }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ProjectCardProps {
  project: ProjectBrief
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusConfig = STATUS_CONFIG[project.status]
  const riskConfig = RISK_CONFIG[project.risk]
  const barColor = progressColor(project.progress)

  const deadline = project.deadline ? formatDeadline(project.deadline) : null

  return (
    <article
      className="bg-[var(--color-surface-2)] border border-[var(--color-border)] hover:border-[var(--color-signal)] rounded-lg p-4 transition-colors flex flex-col gap-3"
      aria-label={`Project: ${project.name}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white truncate">{project.name}</h3>
          <p className="text-xs text-[var(--color-muted)] mt-0.5 line-clamp-2">{project.description}</p>
        </div>

        {/* Risk badge */}
        <span
          role="status"
          aria-label={riskConfig.ariaLabel}
          className={`shrink-0 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide ${riskConfig.className}`}
        >
          {riskConfig.label}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-[var(--color-muted)]">Progress</span>
          <span className="text-[11px] font-mono text-white">{project.progress}%</span>
        </div>
        <div
          className="h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden"
          role="progressbar"
          aria-valuenow={project.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${project.progress}%`}
        >
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--color-border)]">
        {/* Status chip */}
        <span
          className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide ${statusConfig.className}`}
        >
          {statusConfig.label}
        </span>

        <div className="flex items-center gap-3">
          {/* Token budget */}
          {project.tokenBudget !== null && (
            <span className="text-[11px] text-[var(--color-muted)] font-mono">
              €{project.tokenBudget}/mo
            </span>
          )}

          {/* Deadline */}
          {deadline !== null && (
            <span
              className={`text-[11px] font-mono ${deadline.overdue ? 'text-[var(--color-signal)] font-semibold' : 'text-[var(--color-muted)]'}`}
              aria-label={deadline.overdue ? 'Project is overdue' : `Deadline: ${deadline.label}`}
            >
              {deadline.label}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
