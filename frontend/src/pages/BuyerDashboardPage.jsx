import { FormShell } from "../components/FormShell";
import { ListPanel } from "../components/ListPanel";
import { Metric } from "../components/Metric";
import { useAppStore } from "../store/useAppStore";
import { formatMetricLabel } from "../utils/format";

export function BuyerDashboardPage() {
  const { dashboard, loading, loadDashboard, setNotice, setView } = useAppStore();

  if (!dashboard || dashboard.mode !== "buyer") {
    return (
      <FormShell title="Buyer dashboard">
        <button onClick={() => loadDashboard("buyer")} disabled={loading}>Open buyer dashboard</button>
      </FormShell>
    );
  }

  return (
    <section className="dashboard buyer-dashboard">
      <div className="dashboard-head">
        <div>
          <p>Buyer Dashboard</p>
          <h2>{dashboard.user.name}</h2>
        </div>
        <div className="dashboard-actions">
          <button onClick={() => setView("browseProducts")}>Browse products</button>
          <button onClick={() => loadDashboard("buyer")} disabled={loading}>Refresh</button>
        </div>
      </div>

      <MetricGrid summary={dashboard.summary} />

      <div className="dashboard-grid">
        <article className="panel action-panel">
          <h3>Owned item actions</h3>
          <button onClick={() => setNotice("Return flow is the next module to build.")}>Return item</button>
          <button onClick={() => setNotice("P2P resale flow is the next module to build.")}>Resell P2P</button>
          <button onClick={() => setNotice("Recycle flow is the next module to build.")}>Recycle item</button>
          <button onClick={() => setNotice("Donation routing is the next module to build.")}>Donate item</button>
        </article>
        <ListPanel title="Nearby demand" items={dashboard.sections.nearbyDemand} empty="No nearby demand yet." />
        <ListPanel title="Nudges" items={dashboard.sections.nudges} empty="No nudges yet." />
        <ListPanel title="Rewards" items={dashboard.sections.rewards} empty="No rewards yet." />
        <ListPanel title="Recent orders" items={dashboard.sections.recentOrders} empty="No orders yet." />
      </div>
    </section>
  );
}

function MetricGrid({ summary }) {
  return (
    <div className="metric-grid">
      {Object.entries(summary).map(([key, value]) => (
        <Metric key={key} label={formatMetricLabel(key)} value={value} />
      ))}
    </div>
  );
}
