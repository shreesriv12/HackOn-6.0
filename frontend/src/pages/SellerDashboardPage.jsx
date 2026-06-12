import { FormShell } from "../components/FormShell";
import { ListPanel } from "../components/ListPanel";
import { Metric } from "../components/Metric";
import { useAppStore } from "../store/useAppStore";
import { formatMetricLabel } from "../utils/format";

export function SellerDashboardPage() {
  const { dashboard, loading, loadDashboard, setView } = useAppStore();

  if (!dashboard || dashboard.mode !== "seller") {
    return (
      <FormShell title="Seller dashboard">
        <button onClick={() => loadDashboard("seller")} disabled={loading}>Open seller dashboard</button>
      </FormShell>
    );
  }

  return (
    <section className="dashboard seller-dashboard">
      <div className="dashboard-head">
        <div>
          <p>Seller Dashboard</p>
          <h2>{dashboard.user.name}</h2>
        </div>
        <div className="dashboard-actions">
          <button onClick={() => setView("createListing")}>Add product</button>
          <button onClick={() => setView("sellerListings")}>Catalog listings</button>
          <button onClick={() => loadDashboard("seller")} disabled={loading}>Refresh</button>
        </div>
      </div>

      <MetricGrid summary={dashboard.summary} />

      <div className="dashboard-grid">
        <ListPanel title="Catalog listings" items={dashboard.sections.listings} empty="No listings yet." />
        <ListPanel title="Return reasons" items={dashboard.sections.returnReasons} empty="No returns yet." />
        <ListPanel title="Insights" items={dashboard.sections.insights} empty="No insights yet." />
        <ListPanel title="Nudges" items={dashboard.sections.nudges} empty="No nudges yet." />
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
