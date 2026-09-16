import { useState } from 'react';
import { CENTROS } from './mock-data';

function fmt(n: number, d = 0): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });
}

type Periodo = 'semana' | 'mes' | 'trimestre';

const PICOS: { fecha: string; hora: string; kw: number; centro: string; duracion: string }[] = [
  { fecha: '2026-09-16', hora: '16:00', kw: 1628, centro: 'Planta Quilicura', duracion: '45 min' },
  { fecha: '2026-09-15', hora: '15:30', kw: 1580, centro: 'Planta Quilicura', duracion: '30 min' },
  { fecha: '2026-09-12', hora: '16:15', kw: 1545, centro: 'Centro Costanera', duracion: '20 min' },
  { fecha: '2026-09-10', hora: '14:45', kw: 1510, centro: 'Bodega San Bernardo', duracion: '55 min' },
  { fecha: '2026-09-09', hora: '16:00', kw: 1490, centro: 'Planta Quilicura', duracion: '25 min' },
  { fecha: '2026-09-05', hora: '15:00', kw: 1465, centro: 'Centro Costanera', duracion: '35 min' },
  { fecha: '2026-09-03', hora: '17:00', kw: 1420, centro: 'Bodega San Bernardo', duracion: '40 min' },
  { fecha: '2026-09-01', hora: '16:30', kw: 1395, centro: 'Planta Quilicura', duracion: '15 min' },
];

const COMPARATIVA = {
  actual:   { label: 'Sep 2026', consumo: 867.5, peak: 1628, promedio: 36.1, factorCarga: 62.3 },
  anterior: { label: 'Ago 2026', consumo: 832.1, peak: 1590, promedio: 34.7, factorCarga: 60.8 },
};

const FRANJAS = [
  { label: 'Punta', horario: '18:00 – 23:00', color: 'var(--color-danger)', actual: 245.2, anterior: 228.8 },
  { label: 'Llano', horario: '08:00 – 18:00', color: 'var(--color-warning)', actual: 498.1, anterior: 482.4 },
  { label: 'Valle', horario: '23:00 – 08:00', color: 'var(--color-success)', actual: 124.2, anterior: 120.9 },
];

export function ConsumoPage() {
  const [periodo, setPeriodo] = useState<Periodo>('mes');

  const delta = (a: number, b: number) => {
    const pct = b > 0 ? ((a - b) / b) * 100 : 0;
    return { pct, label: `${pct >= 0 ? '↑' : '↓'} ${fmt(Math.abs(pct), 1)}%`, positive: pct <= 0 };
  };

  const c = COMPARATIVA;

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Analítica de Consumo</h1>
          <p className="text-xs text-muted">Peaks de demanda, franjas horarias y comparativas entre períodos</p>
        </div>
        <div className="flex rounded-lg border border-border">
          {(['semana', 'mes', 'trimestre'] as Periodo[]).map((p) => (
            <button key={p} type="button" onClick={() => setPeriodo(p)}
              className={`px-3 py-1.5 text-xs font-medium capitalize ${periodo === p ? 'bg-brand text-brand-fg' : 'text-muted hover:bg-surface'} ${p === 'semana' ? 'rounded-l-lg' : ''} ${p === 'trimestre' ? 'rounded-r-lg' : ''}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Comparativa período actual vs anterior */}
      <div className="rounded-xl border border-card-border bg-card p-4">
        <h2 className="text-sm font-semibold text-card-fg">Comparativa de períodos</h2>
        <p className="mb-4 text-xs text-card-muted">{c.actual.label} vs {c.anterior.label}</p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <CompareCard label="Consumo total" actual={`${fmt(c.actual.consumo, 1)} MWh`} anterior={`${fmt(c.anterior.consumo, 1)} MWh`} delta={delta(c.actual.consumo, c.anterior.consumo)} />
          <CompareCard label="Peak de demanda" actual={`${fmt(c.actual.peak)} kW`} anterior={`${fmt(c.anterior.peak)} kW`} delta={delta(c.actual.peak, c.anterior.peak)} />
          <CompareCard label="Promedio diario" actual={`${fmt(c.actual.promedio, 1)} MWh/d`} anterior={`${fmt(c.anterior.promedio, 1)} MWh/d`} delta={delta(c.actual.promedio, c.anterior.promedio)} />
          <CompareCard label="Factor de carga" actual={`${fmt(c.actual.factorCarga, 1)}%`} anterior={`${fmt(c.anterior.factorCarga, 1)}%`} delta={delta(c.actual.factorCarga, c.anterior.factorCarga)} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Franjas horarias */}
        <div className="rounded-xl border border-card-border bg-card p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-card-fg">Consumo por franja horaria</h2>
          <p className="mb-4 text-xs text-card-muted">Distribución tarifaria del consumo</p>
          <div className="space-y-5">
            {FRANJAS.map((f) => {
              const totalActual = FRANJAS.reduce((s, x) => s + x.actual, 0);
              const pct = (f.actual / totalActual) * 100;
              const d = delta(f.actual, f.anterior);
              return (
                <div key={f.label}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-card-fg">{f.label}</span>
                      <span className="ml-2 text-xs text-card-muted">{f.horario}</span>
                    </div>
                    <span className="font-mono text-xs text-card-muted tabular-nums">{fmt(f.actual, 1)} MWh</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="h-3 flex-1 rounded-full bg-raised">
                      <div className="h-3 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: f.color }} />
                    </div>
                    <span className="w-12 text-right font-mono text-[11px] text-card-muted tabular-nums">{fmt(pct, 0)}%</span>
                  </div>
                  <p className={`mt-1 text-[10px] ${d.positive ? 'text-success' : 'text-danger'}`}>
                    {d.label} vs {c.anterior.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top picos */}
        <div className="rounded-xl border border-card-border bg-card p-4 lg:col-span-3 flex flex-col">
          <h2 className="text-sm font-semibold text-card-fg">Top peaks de demanda</h2>
          <p className="mb-3 text-xs text-card-muted">Máximos registrados en el período</p>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <table className="min-w-full">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-card-border">
                  <Th>#</Th>
                  <Th>Fecha</Th>
                  <Th>Hora</Th>
                  <Th>Demanda</Th>
                  <Th>Centro</Th>
                  <Th>Duración</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {PICOS.map((p, i) => (
                  <tr key={p.fecha + p.hora} className="hover:bg-surface">
                    <td className="px-4 py-2.5 font-mono text-xs text-muted">{i + 1}</td>
                    <td className="px-4 py-2.5 font-mono text-sm text-foreground tabular-nums">{p.fecha}</td>
                    <td className="px-4 py-2.5 font-mono text-sm text-foreground tabular-nums">{p.hora}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-sm font-medium text-foreground tabular-nums">{fmt(p.kw)}</span>
                      <span className="ml-1 text-xs text-muted">kW</span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-muted">{p.centro}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted">{p.duracion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Comparativa centros */}
      <div className="rounded-xl border border-card-border bg-card p-4">
        <h2 className="text-sm font-semibold text-card-fg">Intensidad por centro</h2>
        <p className="mb-3 text-xs text-card-muted">kWh/m² — eficiencia de consumo por superficie</p>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {[...CENTROS].sort((a, b) => b.intensidad - a.intensidad).map((c) => {
            const maxInt = Math.max(...CENTROS.map((x) => x.intensidad));
            const pct = (c.intensidad / maxInt) * 100;
            return (
              <div key={c.id} className="rounded-lg border border-card-border px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-card-fg truncate">{c.name}</span>
                  <span className="font-mono text-xs text-card-muted tabular-nums">{fmt(c.intensidad, 1)}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-raised">
                  <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: pct > 80 ? 'var(--color-danger)' : pct > 50 ? 'var(--color-warning)' : 'var(--color-success)' }} />
                </div>
                <p className="mt-1 text-[10px] text-muted">{fmt(c.superficie)} m² · {fmt(c.consumoMes, 1)} MWh</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CompareCard({ label, actual, anterior, delta }: Readonly<{
  label: string; actual: string; anterior: string; delta: { label: string; positive: boolean };
}>) {
  return (
    <div className="rounded-lg border border-card-border px-3 py-2.5">
      <p className="text-[11px] text-card-muted">{label}</p>
      <p className="mt-1 font-mono text-lg font-bold text-card-fg tabular-nums">{actual}</p>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[10px] text-card-muted">ant: {anterior}</span>
        <span className={`text-[10px] font-medium ${delta.positive ? 'text-success' : 'text-danger'}`}>{delta.label}</span>
      </div>
    </div>
  );
}

function Th({ children }: Readonly<{ children: React.ReactNode }>) {
  return <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted">{children}</th>;
}
