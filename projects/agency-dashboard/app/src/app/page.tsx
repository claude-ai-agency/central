import { OrgChart } from '@/components/org-chart'

export default function DashboardPage() {
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Agency Dashboard
            <span className="text-signal">●</span>
          </h1>
          <p className="text-xs text-muted mt-1">claude-ai-agency — github.com/claude-ai-agency/central</p>
        </div>
      </header>

      <section>
        <h2 className="text-sm font-semibold text-white mb-4">Org Chart</h2>
        <OrgChart />
      </section>
    </main>
  )
}
