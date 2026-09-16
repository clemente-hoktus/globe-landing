interface MockReporte {
  id: string;
  nombre: string;
  tipo: 'mensual' | 'demanda' | 'margen' | 'sostenibilidad';
  formato: 'PDF' | 'Excel';
  periodo: string;
  generado: string;
  tamano: string;
}

const REPORTES: MockReporte[] = [
  { id: 'rpt-1', nombre: 'Reporte mensual — septiembre 2026', tipo: 'mensual', formato: 'PDF', periodo: 'Sep 2026', generado: '2026-09-16 08:00', tamano: '2.4 MB' },
  { id: 'rpt-2', nombre: 'Análisis de demanda punta Q3', tipo: 'demanda', formato: 'Excel', periodo: 'Jul–Sep 2026', generado: '2026-09-15 14:30', tamano: '1.8 MB' },
  { id: 'rpt-3', nombre: 'Margen por centro — agosto 2026', tipo: 'margen', formato: 'PDF', periodo: 'Ago 2026', generado: '2026-09-01 08:00', tamano: '1.2 MB' },
  { id: 'rpt-4', nombre: 'Reporte mensual — agosto 2026', tipo: 'mensual', formato: 'PDF', periodo: 'Ago 2026', generado: '2026-09-01 08:00', tamano: '2.3 MB' },
  { id: 'rpt-5', nombre: 'Huella de carbono H1 2026', tipo: 'sostenibilidad', formato: 'PDF', periodo: 'Ene–Jun 2026', generado: '2026-07-05 10:00', tamano: '3.1 MB' },
  { id: 'rpt-6', nombre: 'Comparativa consumo centros Q2', tipo: 'demanda', formato: 'Excel', periodo: 'Abr–Jun 2026', generado: '2026-07-02 09:00', tamano: '1.5 MB' },
];

const PROGRAMADOS = [
  { nombre: 'Reporte mensual', frecuencia: 'Día 1 de cada mes, 08:00', destino: 'admin@comercializadora.cl', activo: true },
  { nombre: 'Alerta de margen bajo', frecuencia: 'Si margen < 10%, inmediato', destino: 'gerencia@comercializadora.cl', activo: true },
  { nombre: 'Resumen semanal flota', frecuencia: 'Lunes 07:00', destino: 'operaciones@comercializadora.cl', activo: false },
];

const TIPO_CLS: Record<string, string> = {
  mensual: 'bg-info-bg text-info',
  demanda: 'bg-warning-bg text-warning',
  margen: 'bg-success-bg text-success',
  sostenibilidad: 'bg-card text-accent-strong',
};

export function ReportesPage() {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Reportes</h1>
          <p className="text-xs text-muted">Export a PDF y Excel, reportes programados y envío automático</p>
        </div>
        <button type="button" className="rounded-lg bg-brand px-4 py-2 text-xs font-medium text-brand-fg hover:opacity-90">
          + Generar reporte
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Reportes generados" value={String(REPORTES.length)} sub="Este trimestre" />
        <KpiCard label="Programados activos" value={String(PROGRAMADOS.filter((p) => p.activo).length)} sub={`de ${PROGRAMADOS.length} reglas`} />
        <KpiCard label="Último generado" value="Hoy 08:00" sub="Reporte mensual" />
        <KpiCard label="Próximo envío" value="1 Oct 08:00" sub="Reporte mensual" />
      </div>

      <div className="flex-1 rounded-xl border border-card-border bg-card overflow-hidden flex flex-col">
        <div className="px-5 pt-4 pb-2">
          <h2 className="text-sm font-semibold text-card-fg">Reportes generados</h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 z-10 bg-card">
              <tr className="border-t border-card-border">
                <Th>Nombre</Th>
                <Th>Tipo</Th>
                <Th>Formato</Th>
                <Th>Periodo</Th>
                <Th>Generado</Th>
                <Th>Tamaño</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {REPORTES.map((r) => (
                <tr key={r.id} className="hover:bg-surface">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{r.nombre}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${TIPO_CLS[r.tipo]}`}>{r.tipo}</span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted">{r.formato}</td>
                  <td className="px-5 py-3 text-sm text-muted">{r.periodo}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted tabular-nums">{r.generado}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted">{r.tamano}</td>
                  <td className="px-5 py-3">
                    <button type="button" className="text-xs font-medium text-foreground hover:underline">Descargar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-card-border bg-card p-4">
        <h2 className="text-sm font-semibold text-card-fg">Reportes programados</h2>
        <p className="mb-3 text-xs text-card-muted">Envío automático al cierre de cada periodo</p>
        <div className="space-y-2">
          {PROGRAMADOS.map((p) => (
            <div key={p.nombre} className="flex items-center justify-between rounded-lg border border-card-border px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{p.nombre}</p>
                <p className="text-xs text-muted">{p.frecuencia} → {p.destino}</p>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${p.activo ? 'bg-success-bg text-success' : 'bg-raised text-muted'}`}>
                {p.activo ? 'Activo' : 'Pausado'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub }: Readonly<{ label: string; value: string; sub?: string }>) {
  return (
    <div className="rounded-xl border border-card-border bg-card px-4 py-3">
      <p className="text-xs text-card-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-card-fg tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

function Th({ children }: Readonly<{ children?: React.ReactNode }>) {
  return <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted">{children}</th>;
}
