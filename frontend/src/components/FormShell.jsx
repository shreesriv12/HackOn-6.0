export function FormShell({ title, children }) {
  return (
    <section className="form-shell">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
