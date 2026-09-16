import { CENTROS } from './mock-data';

function fmt(n: number, d = 0): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function MargenesPage() {
  const totalCompra = CENTROS.reduce((s, c) => s + c.costoCompra, 0);
  const totalVenta = CENTROS.reduce((s, c) => s + c.precioVenta, 0);
  const totalMargen = CENTROS.reduce((s, c) => s + c.margen, 0);
  const margenPct = totalVenta > 0 ? (totalMargen / totalVenta) * 100 : 0;

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Márgenes</h1>
        <p className="text-xs text-muted">Costo de compra contra precio de venta, con margen por centro y por cliente</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Costo de compra" value={`$${fmt(totalCompra, 1)}M`} sub="Bloque contratado" />
        <KpiCard label="Precio de venta" value={`$${fmt(totalVenta, 1)}M`} sub="Facturado a clientes" />
        <KpiCard label="Margen bruto" value={`$${fmt(totalMargen, 1)}M`} positive delta={`${fmt(margenPct, 1)}% sobre venta`} />
        <KpiCard label="Centros rentables" value={`${CENTROS.filter((c) => c.margenPct > 15).length}/${CENTROS.length}`} sub="Margen > 15%" />
      </div>

      <div className="rounded-xl border border-card-border bg-card p-4">
        <h2 className="text-sm font-semibold text-card-fg">Margen por centro</h2>
        <p className="mb-3 text-xs text-card-muted">Periodo actual — septiembre 2026</p>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-card-border">
                <Th>Centro</Th>
                <Th>Cliente</Th>
                <Th>Compra ($M)</Th>
                <Th>Venta ($M)</Th>
                <Th>Margen ($M)</Th>
                <Th>Margen (%)</Th>
                <Th>Tendencia</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {[...CENTROS].sort((a, b) => b.margenPct - a.margenPct).map((c) => (
                <tr key={c.id} className="hover:bg-surface">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-sm text-muted">{c.cliente}</td>
                  <td className="px-4 py-3 font-mono text-sm text-foreground tabular-nums">${fmt(c.costoCompra, 1)}</td>
                  <td className="px-4 py-3 font-mono text-sm text-foreground tabular-nums">${fmt(c.precioVenta, 1)}</td>
                  <td className="px-4 py-3 font-mono text-sm font-medium text-foreground tabular-nums">${fmt(c.margen, 1)}</td>
                  <td className="px-4 py-3">
                    <MargenBar pct={c.margenPct} />
                  </td>
                  <td className="px-4 py-3 text-xs text-success">↑ estable</td>
                </tr>
              ))}
              <tr className="border-t-2 border-card-border bg-surface font-semibold">
                <td className="px-4 py-3 text-sm text-foreground">Total</td>
                <td className="px-4 py-3 text-sm text-muted">{CENTROS.length} centros</td>
                <td className="px-4 py-3 font-mono text-sm text-foreground tabular-nums">${fmt(totalCompra, 1)}</td>
                <td className="px-4 py-3 font-mono text-sm text-foreground tabular-nums">${fmt(totalVenta, 1)}</td>
                <td className="px-4 py-3 font-mono text-sm font-medium text-foreground tabular-nums">${fmt(totalMargen, 1)}</td>
                <td className="px-4 py-3"><MargenBar pct={margenPct} /></td>
                <td className="px-4 py-3" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MargenBar({ pct }: Readonly<{ pct: number }>) {
  const color = pct >= 20 ? 'var(--color-success)' : pct >= 10 ? 'var(--color-warning)' : 'var(--color-danger)';
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 rounded-full bg-raised">
        <div className="h-2 rounded-full" style={{ width: `${Math.min(pct * 2, 100)}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-xs text-muted tabular-nums">{fmt(pct, 1)}%</span>
    </div>
  );
}

function KpiCard({ label, value, sub, delta, positive }: Readonly<{ label: string; value: string; sub?: string; delta?: string; positive?: boolean }>) {
  return (
    <div className="rounded-xl border border-card-border bg-card px-4 py-3">
      <p className="text-xs text-card-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-card-fg tabular-nums">{value}</p>
      {delta && <p className={`mt-1 text-[11px] ${positive ? 'text-success' : 'text-muted'}`}>↑ {delta}</p>}
      {sub && !delta && <p className="mt-1 text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

function Th({ children }: Readonly<{ children: React.ReactNode }>) {
  return <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted">{children}</th>;
}
