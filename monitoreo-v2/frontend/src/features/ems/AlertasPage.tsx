import { REMARCADORES } from './mock-data';
import { StatusBadge } from './StatusBadge';

interface MockAlerta {
  id: string;
  tipo: 'desconexion' | 'pico' | 'umbral';
  severidad: 'alarma' | 'advertencia' | 'operativo';
  mensaje: string;
  centro: string;
  remarcador: string;
  timestamp: string;
  estado: 'abierta' | 'reconocida' | 'resuelta';
}

const ALERTAS: MockAlerta[] = [
  { id: 'a1', tipo: 'desconexion', severidad: 'alarma', mensaje: 'Sin lecturas por más de 3 horas', centro: 'Bodega San Bernardo', remarcador: 'MTR-03310', timestamp: '2026-09-16 09:33', estado: 'abierta' },
  { id: 'a2', tipo: 'pico', severidad: 'advertencia', mensaje: 'Peak de demanda supera 90% del contratado', centro: 'Planta Quilicura', remarcador: 'MTR-02204', timestamp: '2026-09-16 11:15', estado: 'abierta' },
  { id: 'a3', tipo: 'umbral', severidad: 'advertencia', mensaje: 'Señal degradada bajo 25%', centro: 'Planta Quilicura', remarcador: 'MTR-02205', timestamp: '2026-09-16 12:04', estado: 'reconocida' },
  { id: 'a4', tipo: 'pico', severidad: 'advertencia', mensaje: 'Consumo horario 40% sobre promedio histórico', centro: 'Centro Costanera', remarcador: 'MTR-04821', timestamp: '2026-09-15 16:22', estado: 'resuelta' },
  { id: 'a5', tipo: 'desconexion', severidad: 'alarma', mensaje: 'Timeout de comunicación con gateway', centro: 'Sucursal Maipú', remarcador: 'MTR-01180', timestamp: '2026-09-14 03:10', estado: 'resuelta' },
  { id: 'a6', tipo: 'umbral', severidad: 'operativo', mensaje: 'Consumo nocturno dentro del rango esperado', centro: 'Centro Vitacura', remarcador: 'MTR-02610', timestamp: '2026-09-16 06:00', estado: 'resuelta' },
];

const TIPO_LABELS: Record<string, string> = { desconexion: 'Desconexión', pico: 'Peak de demanda', umbral: 'Umbral de consumo' };
const ESTADO_CLS: Record<string, string> = {
  abierta: 'bg-danger-bg text-danger',
  reconocida: 'bg-warning-bg text-warning',
  resuelta: 'bg-success-bg text-success',
};

export function AlertasPage() {
  const abiertas = ALERTAS.filter((a) => a.estado === 'abierta').length;
  const reconocidas = ALERTAS.filter((a) => a.estado === 'reconocida').length;
  const caidos = REMARCADORES.filter((r) => r.estado === 'caido').length;

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Alertas</h1>
        <p className="text-xs text-muted">Reglas de peak, desconexión y umbral de consumo</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Abiertas" value={String(abiertas)} negative />
        <StatCard label="Reconocidas" value={String(reconocidas)} />
        <StatCard label="Resueltas hoy" value={String(ALERTAS.filter((a) => a.estado === 'resuelta').length)} positive />
        <StatCard label="Dispositivos caídos" value={String(caidos)} negative />
      </div>

      <div className="flex-1 rounded-xl border border-card-border bg-card overflow-hidden flex flex-col">
        <div className="px-5 pt-4 pb-2">
          <h2 className="text-sm font-semibold text-card-fg">Historial de alertas</h2>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 z-10 bg-card">
              <tr className="border-t border-card-border">
                <Th>Tipo</Th>
                <Th>Severidad</Th>
                <Th>Mensaje</Th>
                <Th>Centro</Th>
                <Th>Remarcador</Th>
                <Th>Fecha</Th>
                <Th>Estado</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {ALERTAS.map((a) => (
                <tr key={a.id} className="hover:bg-surface">
                  <td className="px-5 py-3 text-xs font-medium text-foreground">{TIPO_LABELS[a.tipo]}</td>
                  <td className="px-5 py-3"><StatusBadge estado={a.severidad} /></td>
                  <td className="px-5 py-3 text-sm text-foreground max-w-xs truncate">{a.mensaje}</td>
                  <td className="px-5 py-3 text-sm text-muted">{a.centro}</td>
                  <td className="px-5 py-3 font-mono text-sm text-muted">{a.remarcador}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted tabular-nums">{a.timestamp}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ESTADO_CLS[a.estado]}`}>
                      {a.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, positive, negative }: Readonly<{ label: string; value: string; positive?: boolean; negative?: boolean }>) {
  return (
    <div className="rounded-xl border border-card-border bg-card px-4 py-3">
      <p className="text-xs text-card-muted">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-bold tabular-nums ${negative ? 'text-danger' : positive ? 'text-success' : 'text-card-fg'}`}>{value}</p>
    </div>
  );
}

function Th({ children }: Readonly<{ children: React.ReactNode }>) {
  return <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted">{children}</th>;
}
