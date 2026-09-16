import { useNavigate } from 'react-router';
import { RESUMEN_KPIS, CENTROS, REMARCADORES, CURVA_CARGA_GLOBAL } from './mock-data';

function fmt(n: number, d = 0): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });
}

export function ResumenPage() {
  const navigate = useNavigate();
  const k = RESUMEN_KPIS;
  const desconectados = REMARCADORES.filter((r) => r.estado === 'caido');

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Resumen</h1>
          <p className="text-xs text-muted">Periodo: septiembre 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            En vivo
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Consumo del mes" value={fmt(k.consumoMes, 1)} unit="MWh" delta={`↑ ${k.consumoDelta}% vs agosto`} positive />
        <KpiCard label="Gasto en compra" value={`$${fmt(k.gastoCompra, 1)}M`} delta={`↑ ${k.gastoDelta}% vs agosto`} />
        <KpiCard label="Margen estimado" value={`$${fmt(k.margenEstimado, 1)}M`} delta={`↑ ${k.margenDelta}% sobre venta`} positive />
        <KpiCard label="Centros activos" value={String(k.centrosActivos)} delta={`+${k.centrosDelta} este trimestre`} positive />
        <KpiCard label="Remarcadores" value={`${k.remarcadoresConectados}`} unit={`/${k.remarcadoresTotal}`} delta={`↓ ${k.remarcadoresCaidos} caído · ${k.remarcadoresSinSenal} sin señal`} negative />
        <KpiCard label="Peak de demanda" value={fmt(k.peakDemanda)} unit="kWh" delta={`Peak a las ${k.peakHora}`} />
      </div>

      {desconectados.length > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-warning/30 bg-warning-bg px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-warning">⚠</span>
            <div>
              <p className="text-sm font-medium text-foreground">
                {desconectados[0].code} lleva 3 h 12 min sin reportar
              </p>
              <p className="text-xs text-muted">
                Se generó automáticamente una alerta de desconexión para {desconectados[0].centroName}.
              </p>
            </div>
          </div>
          <button type="button" className="text-xs font-medium text-foreground hover:underline" onClick={() => navigate('/alertas')}>
            Ver alertas
          </button>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-xl border border-card-border bg-card p-4 lg:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-card-fg">Curva de carga global · hoy</h2>
              <p className="mb-3 text-xs text-card-muted">Consumo agregado de los {k.centrosActivos} centros, por hora</p>
            </div>
            <span className="rounded-full bg-surface px-2.5 py-1 font-mono text-xs font-medium text-card-fg">Peak{k.peakHora}</span>
          </div>
          <AreaChart data={CURVA_CARGA_GLOBAL} />
        </div>

        <div className="rounded-xl border border-card-border bg-card p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-card-fg">Centros por consumo</h2>
          <p className="mb-3 text-xs text-card-muted">Acumulado del mes</p>
          <div className="space-y-3">
            {[...CENTROS].sort((a, b) => b.consumoMes - a.consumoMes).map((c) => {
              const max = Math.max(...CENTROS.map((x) => x.consumoMes));
              const pct = (c.consumoMes / max) * 100;
              const colors: Record<string, string> = { operativo: 'var(--color-accent)', advertencia: 'var(--color-warning)', alarma: 'var(--color-danger)' };
              return (
                <button key={c.id} type="button" onClick={() => navigate(`/centros/${c.id}`)} className="flex w-full items-center gap-3 text-left hover:opacity-80">
                  <span className="w-36 truncate text-xs text-card-fg">{c.name}</span>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-raised">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: colors[c.estado] }} />
                    </div>
                  </div>
                  <span className="w-20 text-right font-mono text-xs text-card-muted">{fmt(c.consumoMes, 1)} MWh</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function AreaChart({ data }: Readonly<{ data: number[] }>) {
  const max = Math.max(...data, 1);
  const W = 600;
  const H = 200;
  const padTop = 10;
  const padBottom = 22;
  const padX = 40;
  const chartW = W - padX;
  const chartH = H - padTop - padBottom;
  const baseline = padTop + chartH;

  const points = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padTop + chartH - (v / max) * chartH,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${baseline} L${padX},${baseline} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    y: padTop + chartH - pct * chartH,
    label: fmt(Math.round(max * pct)),
  }));

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        {yTicks.map((t) => (
          <g key={t.y}>
            <line x1={padX} y1={t.y} x2={W} y2={t.y} stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3,3" />
            <text x={padX - 4} y={t.y + 3} textAnchor="end" fill="var(--color-muted)" fontSize="8" fontFamily="var(--font-mono)">{t.label}</text>
          </g>
        ))}
        <line x1={padX} y1={baseline} x2={W} y2={baseline} stroke="var(--color-border)" strokeWidth="0.5" />
        {data.map((_, i) => i % 3 === 0 ? (
          <text key={i} x={points[i].x} y={baseline + 14} textAnchor="middle" fill="var(--color-muted)" fontSize="8" fontFamily="var(--font-mono)">
            {String(i).padStart(2, '0')}:00
          </text>
        ) : null)}
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <div className="mt-1 flex items-center gap-1.5 px-1">
        <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }} />
        <span className="text-[10px] text-card-muted">Consumo horario (kWh)</span>
      </div>
    </div>
  );
}

function KpiCard({ label, value, unit, delta, positive, negative }: Readonly<{
  label: string; value: string; unit?: string; delta?: string; positive?: boolean; negative?: boolean;
}>) {
  const deltaColor = negative ? 'text-danger' : positive ? 'text-success' : 'text-muted';
  return (
    <div className="rounded-xl border border-card-border bg-card px-4 py-3">
      <p className="text-xs text-card-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-card-fg tabular-nums">
        {value}
        {unit && <span className="ml-0.5 text-sm font-normal text-card-muted">{unit}</span>}
      </p>
      {delta && <p className={`mt-1 text-[11px] ${deltaColor}`}>{delta}</p>}
    </div>
  );
}
