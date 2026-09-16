import { useParams, useNavigate } from 'react-router';
import { CENTROS, REMARCADORES } from './mock-data';
import { StatusBadge } from './StatusBadge';

function fmt(n: number, d = 0): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function CentroDetailPage() {
  const { centroId } = useParams<{ centroId: string }>();
  const navigate = useNavigate();
  const centro = CENTROS.find((c) => c.id === centroId);
  const meters = REMARCADORES.filter((r) => r.centroId === centroId);

  if (!centro) return <div className="flex h-full items-center justify-center text-sm text-muted">Centro no encontrado.</div>;

  const curva = meters.length > 0
    ? meters[0].consumoHoy.map((_, i) => meters.reduce((s, m) => s + m.consumoHoy[i], 0))
    : [];

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-6">
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <button type="button" onClick={() => navigate('/centros')} className="flex items-center gap-1 text-xs text-muted hover:text-foreground">
            ← Volver a Centros
          </button>
          <h1 className="mt-1 text-lg font-bold text-foreground">{centro.name}</h1>
          <div className="mt-1 flex flex-wrap gap-2">
            <StatusBadge estado={centro.estado} />
            <Tag>{centro.cliente}</Tag>
            <Tag>{centro.comuna}</Tag>
            <Tag>{fmt(centro.superficie)} m²</Tag>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => navigate('/margenes')} className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-raised">Ver margen</button>
          <button type="button" className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-raised">Ver remarcadores</button>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Consumo del mes" value={fmt(centro.consumoMes, 1)} unit="MWh" delta={`↑ 2,8% vs mes anterior`} />
        <KpiCard label="Costo de compra" value={`$${fmt(centro.costoCompra, 1)}M`} sub="Bloque contratado" />
        <KpiCard label="Precio de venta" value={`$${fmt(centro.precioVenta, 1)}M`} sub="Facturado al cliente" />
        <KpiCard label="Margen del periodo" value={`$${fmt(centro.margen, 1)}M`} delta={`↑ ${fmt(centro.margenPct, 1)}% sobre venta`} />
      </div>

      <div className="grid shrink-0 gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-card-border bg-card p-4 lg:col-span-3">
          <h2 className="text-sm font-semibold text-card-fg">Curva de carga · hoy</h2>
          <p className="mb-2 text-xs text-card-muted">{centro.name}</p>
          <CurvaAreaChart data={curva} />
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-card-fg">Ficha del centro</h2>
          <div className="mt-2 space-y-2">
            <FichaRow label="Cliente" value={centro.cliente} />
            <FichaRow label="Superficie" value={`${fmt(centro.superficie)} m²`} />
            <FichaRow label="Intensidad" value={`${fmt(centro.intensidad, 1)} kWh/m²`} />
            <FichaRow label="Precio medio venta" value={`$${Math.round(centro.precioVenta / centro.consumoMes * 1000)}/kWh`} />
            <FichaRow label="Costo medio compra" value={`$${Math.round(centro.costoCompra / centro.consumoMes * 1000)}/kWh`} />
            <FichaRow label="Remarcadores" value={String(meters.length)} />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-card-border bg-card">
        <div className="shrink-0 px-5 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-card-fg">Remarcadores del centro</h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-t border-card-border">
                <Th>ID</Th>
                <Th>Modelo</Th>
                <Th>Señal</Th>
                <Th>Última lectura</Th>
                <Th>Estado</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {meters.map((m) => (
                <tr key={m.id} className="cursor-pointer hover:bg-surface" onClick={() => navigate(`/remarcadores/${m.id}`)}>
                  <td className="px-5 py-3 font-mono text-sm font-medium text-foreground">{m.code}</td>
                  <td className="px-5 py-3 font-mono text-sm text-muted">{m.modelo}</td>
                  <td className="px-5 py-3 font-mono text-sm text-muted">{m.signal}%</td>
                  <td className="px-5 py-3 font-mono text-sm text-muted tabular-nums">{m.ultimaLectura}</td>
                  <td className="px-5 py-3"><StatusBadge estado={m.estado} /></td>
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

function Tag({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">{children}</span>;
}

function KpiCard({ label, value, unit, delta, sub }: Readonly<{ label: string; value: string; unit?: string; delta?: string; sub?: string }>) {
  return (
    <div className="rounded-xl border border-card-border bg-card px-4 py-3">
      <p className="text-xs text-card-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-card-fg tabular-nums">
        {value}{unit && <span className="ml-0.5 text-sm font-normal text-card-muted">{unit}</span>}
      </p>
      {delta && <p className="mt-1 text-[11px] text-success">{delta}</p>}
      {sub && <p className="mt-1 text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

function FichaRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex items-center justify-between border-b border-card-border pb-2 last:border-0">
      <span className="text-xs text-card-muted">{label}</span>
      <span className="font-mono text-xs font-medium text-card-fg">{value}</span>
    </div>
  );
}

function CurvaAreaChart({ data }: Readonly<{ data: number[] }>) {
  const max = Math.max(...data, 1);
  const W = 500;
  const H = 160;
  const padY = 16;
  const padX = 30;
  const chartW = W - padX;
  const chartH = H - padY;

  const points = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padY + chartH - (v / max) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${H} L${padX},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="centroAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((pct) => {
        const y = padY + chartH - pct * chartH;
        return <line key={pct} x1={padX} y1={y} x2={W} y2={y} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3,3" />;
      })}
      {data.map((_, i) => i % 3 === 0 && points[i] ? (
        <text key={i} x={points[i].x} y={H - 1} textAnchor="middle" fill="var(--color-muted)" fontSize="7" fontFamily="var(--font-mono)">
          {String(i).padStart(2, '0')}:00
        </text>
      ) : null)}
      <path d={areaPath} fill="url(#centroAreaGrad)" />
      <path d={linePath} fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function Th({ children }: Readonly<{ children?: React.ReactNode }>) {
  return <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted">{children}</th>;
}
