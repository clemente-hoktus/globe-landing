import { useNavigate } from 'react-router';
import { REMARCADORES } from './mock-data';
import { StatusBadge } from './StatusBadge';

export function RemarcadoresPage() {
  const navigate = useNavigate();
  const conectados = REMARCADORES.filter((r) => r.estado === 'conectado').length;
  const sinSenal = REMARCADORES.filter((r) => r.estado === 'sin_senal').length;
  const caidos = REMARCADORES.filter((r) => r.estado === 'caido').length;
  const desconectado = REMARCADORES.find((r) => r.estado === 'caido');

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Remarcadores</h1>
        <p className="text-xs text-muted">{REMARCADORES.length} dispositivos en la flota</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Dispositivos" value={String(REMARCADORES.length)} sub={`${new Set(REMARCADORES.map((r) => r.centroId)).size} centros cubiertos`} />
        <StatCard label="Conectados" value={String(conectados)} sub={`↑ ${((conectados / REMARCADORES.length) * 100).toFixed(1)}% de la flota`} positive />
        <StatCard label="Sin señal" value={String(sinSenal)} sub="Señal bajo 25%" />
        <StatCard label="Caídos" value={String(caidos)} sub="↓ Alerta generada" negative />
      </div>

      {desconectado && (
        <div className="flex items-center justify-between rounded-lg border border-danger/30 bg-danger-bg px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-danger">⊘</span>
            <div>
              <p className="text-sm font-medium text-foreground">{desconectado.code} lleva 3 h 12 min sin reportar</p>
              <p className="text-xs text-muted">Se generó automáticamente una alerta de desconexión para {desconectado.centroName}.</p>
            </div>
          </div>
          <button type="button" className="text-xs font-medium text-foreground hover:underline" onClick={() => navigate('/alertas')}>
            Ver alertas
          </button>
        </div>
      )}

      <div className="flex-1 rounded-xl border border-card-border bg-card overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div>
            <h2 className="text-sm font-semibold text-card-fg">Flota de remarcadores</h2>
            <p className="text-xs text-card-muted">Haz clic en un dispositivo para ver su detalle</p>
          </div>
          <button type="button" className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-raised">
            ⚡ Forzar lectura
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <table className="min-w-full">
            <thead className="sticky top-0 z-10 bg-card">
              <tr className="border-t border-card-border">
                <Th>ID</Th>
                <Th>Centro</Th>
                <Th>Modelo</Th>
                <Th>Señal</Th>
                <Th>Última lectura</Th>
                <Th>Estado</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {REMARCADORES.map((r) => (
                <tr key={r.id} className="cursor-pointer hover:bg-surface" onClick={() => navigate(`/remarcadores/${r.id}`)}>
                  <td className="px-5 py-3 font-mono text-sm font-medium text-foreground">{r.code}</td>
                  <td className="px-5 py-3 text-sm text-foreground">{r.centroName}</td>
                  <td className="px-5 py-3 font-mono text-sm text-muted">{r.modelo}</td>
                  <td className="px-5 py-3">
                    <SignalBars signal={r.signal} />
                  </td>
                  <td className="px-5 py-3 font-mono text-sm text-muted tabular-nums">{r.ultimaLectura}</td>
                  <td className="px-5 py-3"><StatusBadge estado={r.estado} /></td>
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

function SignalBars({ signal }: Readonly<{ signal: number }>) {
  const bars = signal >= 75 ? 4 : signal >= 50 ? 3 : signal >= 25 ? 2 : signal > 0 ? 1 : 0;
  const color = bars >= 3 ? 'var(--color-success)' : bars >= 2 ? 'var(--color-warning)' : 'var(--color-danger)';
  return (
    <span className="inline-flex items-end gap-0.5">
      {[1, 2, 3, 4].map((b) => (
        <span key={b} className="w-1 rounded-sm" style={{ height: `${b * 3 + 2}px`, backgroundColor: b <= bars ? color : 'var(--color-border)' }} />
      ))}
      <span className="ml-1 font-mono text-xs text-muted tabular-nums">{signal}%</span>
    </span>
  );
}

function StatCard({ label, value, sub, positive, negative }: Readonly<{ label: string; value: string; sub: string; positive?: boolean; negative?: boolean }>) {
  return (
    <div className="rounded-xl border border-card-border bg-card px-4 py-3">
      <p className="text-xs text-card-muted">{label}</p>
      <p className="mt-1 font-mono text-2xl font-bold text-card-fg tabular-nums">{value}</p>
      <p className={`mt-1 text-[11px] ${negative ? 'text-danger' : positive ? 'text-success' : 'text-muted'}`}>{sub}</p>
    </div>
  );
}

function Th({ children }: Readonly<{ children?: React.ReactNode }>) {
  return <th className="px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted">{children}</th>;
}
