import { FormShell } from "../components/FormShell";
import { ListPanel } from "../components/ListPanel";
import { Metric } from "../components/Metric";
import { useAppStore } from "../store/useAppStore";
import { formatMetricLabel } from "../utils/format";

export function AdminDashboardPage() {
  const { dashboard, loading, loadDashboard } = useAppStore();

  if (!dashboard || dashboard.mode !== "admin") {
    return (
      <FormShell title="Admin panel">
        <button onClick={() => loadDashboard("admin")} disabled={loading}>Open admin panel</button>
      </FormShell>
    );
  }

  return (
    <section className="dashboard admin-dashboard">
      <div className="dashboard-head">
        <div>
          <p>Admin Panel</p>
          <h2>{dashboard.user.name}</h2>
        </div>
        <button onClick={() => loadDashboard("admin")} disabled={loading}>Refresh</button>
      </div>

      <div className="metric-grid">
        {Object.entries(dashboard.summary).map(([key, value]) => (
          <Metric key={key} label={formatMetricLabel(key)} value={value} />
        ))}
      </div>

      <div className="dashboard-grid">
        <ListPanel title="Modules" items={dashboard.sections.modules} empty="No admin modules yet." />
        <ListPanel title="Alerts" items={dashboard.sections.alerts} empty="No alerts." />
        <ListPanel title="Reports" items={dashboard.sections.reports} empty="No reports yet." />
      </div>
    </section>
  );
}
