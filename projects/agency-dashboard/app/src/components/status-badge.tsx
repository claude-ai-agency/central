import type { AgentStatus } from '@/lib/agents/types'

const CONFIG: Record<AgentStatus, { dot: string; label: string; ariaLabel: string }> = {
  active: {
    dot: 'bg-green-500',
    label: 'Active',
    ariaLabel: 'Agent status: active',
  },
  'pending-hire': {
    dot: 'bg-yellow-400',
    label: 'Pending',
    ariaLabel: 'Agent status: pending hire',
  },
  offline: {
    dot: 'bg-zinc-500',
    label: 'Offline',
    ariaLabel: 'Agent status: offline',
  },
}

const FALLBACK = {
  dot: 'bg-zinc-600',
  label: 'Unknown',
  ariaLabel: 'Agent status: unknown',
}

interface StatusBadgeProps {
  status: AgentStatus | string
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = CONFIG[status as AgentStatus] ?? FALLBACK
  const dotSize = size === 'md' ? 'w-2 h-2' : 'w-1.5 h-1.5'
  const textSize = size === 'md' ? 'text-xs' : 'text-[11px]'

  return (
    <span
      role="status"
      aria-label={config.ariaLabel}
      className={`inline-flex items-center gap-1.5 ${textSize} text-muted`}
    >
      <span
        className={`${dotSize} rounded-full ${config.dot} shrink-0`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  )
}
