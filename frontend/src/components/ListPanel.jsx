export function ListPanel({ title, items, empty }) {
  return (
    <article className="panel">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="empty-state">{empty}</p>
      ) : (
        items.map((item) => (
          <div className="demand-row" key={JSON.stringify(item)}>
            {String(item)}
          </div>
        ))
      )}
    </article>
  );
}
