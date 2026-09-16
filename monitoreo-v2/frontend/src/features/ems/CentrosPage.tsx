import { useNavigate } from 'react-router';
import { CENTROS } from './mock-data';
import { StatusBadge } from './StatusBadge';

function fmt(n: number, d = 0): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function CentrosPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Centros</h1>
          <p className="text-xs text-muted">{CENTROS.length} centros activos</p>
        </div>
        <button type="button" className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-raised">
          + Nuevo centro
        </button>
      </div>

      <div className="rounded-xl border border-card-border bg-card">
        <div className="px-5 pt-4 pb-2">
          <h2 className="text-sm font-semibold text-card-fg">Cartera de centros</h2>
          <p className="text-xs text-card-muted">Haz clic en una fila para ver el detalle</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-t border-card-border">
                <Th>Centro</Th>
                <Th>Comuna</Th>
                <Th>Consumo mes</Th>
                <Th>Margen</Th>
                <Th>Estado</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {CENTROS.map((c) => (
                <tr key={c.id} className="cursor-pointer hover:bg-surface" onClick={() => navigate(`/centros/${c.id}`)}>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted">{c.cliente}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground">{c.comuna}</td>
                  <td className="px-5 py-3 font-mono text-sm text-foreground tabular-nums">{fmt(c.consumoMes, 1)} <span className="text-xs text-muted">MWh</span></td>
                  <td className="px-5 py-3 font-mono text-sm text-foreground tabular-nums">${fmt(c.margen, 1)}M <span className="text-xs text-muted">({fmt(c.margenPct, 1)}%)</span></td>
                  <td className="px-5 py-3"><StatusBadge estado={c.estado} /></td>
                  <td className="px-5 py-3 text-muted">›</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: Readonly<{ children?: React.ReactNode }>) {
  return <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted">{children}</th>;
}
