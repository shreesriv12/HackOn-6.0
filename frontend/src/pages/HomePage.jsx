export function HomePage({ onSignup, onLogin }) {
  return (
    <>
      <section className="hero">
        <div>
          <p>Amazon Circular</p>
          <h1>Shop, sell, and return smarter.</h1>
          <span>Use one account for buying and selling. Admins manage operations separately.</span>
        </div>
        <div className="hero-actions">
          <button onClick={onLogin}>Sign in</button>
          <button className="secondary" onClick={onSignup}>Create account</button>
        </div>
      </section>
      <section className="deal-grid">
        <InfoCard title="Buyer dashboard" text="Orders, matches, returns, rewards, and nearby demand." />
        <InfoCard title="Seller dashboard" text="Listings, return reasons, recovered revenue, and insights." />
        <InfoCard title="Admin panel" text="Users, listings, returns, rewards, partners, and reports." />
        <InfoCard title="One email" text="Use the same email to open buyer or seller dashboards." />
      </section>
    </>
  );
}

function InfoCard({ title, text }) {
  return (
    <article className="deal-card">
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  );
}
