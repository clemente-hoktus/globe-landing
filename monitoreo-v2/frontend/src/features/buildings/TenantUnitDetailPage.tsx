import { useParams, useNavigate, Link } from 'react-router';
import { Card } from '../../components/ui/Card';

interface MockMeter {
  id: string;
  name: string;
  code: string;
  meterType: string;
  phaseType: string;
  model: string | null;
  isActive: boolean;
  lastReading: string;
  kwh: number;
  kw: number;
}

const MOCK_UNITS: Record<string, { name: string; unitCode: string; contactName: string | null; contactEmail: string | null; meters: MockMeter[] }> = {
  'mock-1': {
    name: 'Local 101 — Farmacia Cruz Verde',
    unitCode: 'L-101',
    contactName: 'María López',
    contactEmail: 'mlopez@cruzverde.cl',
    meters: [
      { id: 'm-1a', name: 'Tablero Principal L101', code: 'EM-101-A', meterType: 'electrical', phaseType: 'three_phase', model: 'Shark 200', isActive: true, lastReading: '2026-09-16 08:30', kwh: 12450, kw: 18.3 },
      { id: 'm-1b', name: 'Iluminacion L101', code: 'EM-101-B', meterType: 'electrical', phaseType: 'single_phase', model: 'Shark 100', isActive: true, lastReading: '2026-09-16 08:30', kwh: 3210, kw: 4.1 },
    ],
  },
  'mock-2': {
    name: 'Local 102 — Starbucks',
    unitCode: 'L-102',
    contactName: 'Carlos Muñoz',
    contactEmail: 'cmunoz@starbucks.cl',
    meters: [
      { id: 'm-2a', name: 'Tablero General L102', code: 'EM-102-A', meterType: 'electrical', phaseType: 'three_phase', model: 'Shark 200', isActive: true, lastReading: '2026-09-16 08:30', kwh: 8920, kw: 14.7 },
      { id: 'm-2b', name: 'HVAC L102', code: 'EM-102-B', meterType: 'electrical', phaseType: 'three_phase', model: 'Shark 200', isActive: true, lastReading: '2026-09-16 08:30', kwh: 6100, kw: 11.2 },
      { id: 'm-2c', name: 'Equipos Cocina L102', code: 'EM-102-C', meterType: 'electrical', phaseType: 'single_phase', model: 'Shark 100', isActive: true, lastReading: '2026-09-16 08:25', kwh: 4530, kw: 8.9 },
    ],
  },
  'mock-3': {
    name: 'Local 201 — Banco Estado',
    unitCode: 'L-201',
    contactName: 'Andrea Soto',
    contactEmail: 'asoto@bancoestado.cl',
    meters: [
      { id: 'm-3a', name: 'Tablero Principal L201', code: 'EM-201-A', meterType: 'electrical', phaseType: 'three_phase', model: 'Shark 200', isActive: true, lastReading: '2026-09-16 08:30', kwh: 15200, kw: 22.5 },
    ],
  },
  'mock-4': {
    name: 'Local 202 — Claro',
    unitCode: 'L-202',
    contactName: null,
    contactEmail: null,
    meters: [],
  },
  'mock-5': {
    name: 'Patio de Comidas',
    unitCode: 'PC-01',
    contactName: 'Javier Reyes',
    contactEmail: 'jreyes@mall.cl',
    meters: [
      { id: 'm-5a', name: 'Tablero General PC', code: 'EM-PC-A', meterType: 'electrical', phaseType: 'three_phase', model: 'Shark 200', isActive: true, lastReading: '2026-09-16 08:30', kwh: 34100, kw: 52.3 },
      { id: 'm-5b', name: 'Iluminacion PC', code: 'EM-PC-B', meterType: 'electrical', phaseType: 'three_phase', model: 'Shark 200', isActive: true, lastReading: '2026-09-16 08:30', kwh: 8700, kw: 12.1 },
      { id: 'm-5c', name: 'HVAC PC', code: 'EM-PC-C', meterType: 'electrical', phaseType: 'three_phase', model: 'Shark 200', isActive: true, lastReading: '2026-09-16 08:25', kwh: 21300, kw: 38.6 },
      { id: 'm-5d', name: 'Equipos Locatarios PC', code: 'EM-PC-D', meterType: 'electrical', phaseType: 'three_phase', model: 'Shark 100', isActive: false, lastReading: '2026-08-01 14:00', kwh: 0, kw: 0 },
    ],
  },
};

function fmtNum(n: number, decimals = 0): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function TenantUnitDetailPage() {
  const { buildingId, unitId } = useParams<{ buildingId: string; unitId: string }>();
  const navigate = useNavigate();

  const unit = MOCK_UNITS[unitId!];

  if (!unit) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted">
        Local no encontrado.
      </div>
    );
  }

  const activeMeters = unit.meters.filter((m) => m.isActive);
  const totalKwh = activeMeters.reduce((s, m) => s + m.kwh, 0);
  const totalKw = activeMeters.reduce((s, m) => s + m.kw, 0);

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 px-1">
        <button
          type="button"
          onClick={() => navigate(`/buildings/${buildingId}`)}
          className="rounded-md border border-border px-2.5 py-1 text-xs text-muted hover:bg-surface"
        >
          &larr; Volver
        </button>
        <Link to="/buildings" className="text-sm text-muted hover:text-foreground">Edificios</Link>
        <span className="text-xs text-subtle">/</span>
        <Link to={`/buildings/${buildingId}`} className="text-sm text-muted hover:text-foreground">Detalle</Link>
        <span className="text-xs text-subtle">/</span>
        <span className="text-sm font-semibold text-foreground">{unit.name}</span>
      </div>

      {/* Unit info + KPIs */}
      <div className="grid shrink-0 grid-cols-2 gap-3 px-1 sm:grid-cols-4">
        <KpiCard label="Medidores activos" value={String(activeMeters.length)} sub={`de ${unit.meters.length} total`} />
        <KpiCard label="Consumo acumulado" value={fmtNum(totalKwh)} unit="kWh" />
        <KpiCard label="Demanda actual" value={fmtNum(totalKw, 1)} unit="kW" />
        <KpiCard label="Contacto" value={unit.contactName ?? '—'} sub={unit.contactEmail ?? ''} />
      </div>

      {/* Meters table */}
      <Card className="flex min-h-0 flex-1 flex-col" noPadding>
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <h2 className="text-sm font-semibold text-foreground">Medidores del local</h2>
          <span className="text-xs text-muted">{unit.meters.length} medidor{unit.meters.length !== 1 ? 'es' : ''}</span>
        </div>
        {unit.meters.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted">
            Sin medidores asignados a este local.
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
            <table className="min-w-full divide-y divide-border">
              <thead className="sticky top-0 z-10 bg-background">
                <tr>
                  <Th>Nombre</Th>
                  <Th>Codigo</Th>
                  <Th>Fase</Th>
                  <Th>Modelo</Th>
                  <Th>Ultima lectura</Th>
                  <Th>kWh</Th>
                  <Th>kW</Th>
                  <Th>Estado</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {unit.meters.map((m) => (
                  <tr
                    key={m.id}
                    className="cursor-pointer hover:bg-surface"
                    onClick={() => navigate(`/monitoring/meter/${m.id}`)}
                  >
                    <Td className="font-medium text-foreground">{m.name}</Td>
                    <Td className="font-mono text-xs">{m.code}</Td>
                    <Td>{m.phaseType === 'three_phase' ? 'Trifasico' : 'Monofasico'}</Td>
                    <Td>{m.model ?? '—'}</Td>
                    <Td className="text-xs text-muted">{m.lastReading}</Td>
                    <Td className="tabular-nums">{fmtNum(m.kwh)}</Td>
                    <Td className="tabular-nums">{fmtNum(m.kw, 1)}</Td>
                    <Td>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        m.isActive ? 'bg-success/10 text-success' : 'bg-raised text-muted'
                      }`}>
                        {m.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function KpiCard({ label, value, unit, sub }: Readonly<{ label: string; value: string; unit?: string; sub?: string }>) {
  return (
    <div className="rounded-lg border border-card-border bg-card px-4 py-3">
      <p className="text-xs text-card-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-card-fg tabular-nums">
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-card-muted">{unit}</span>}
      </p>
      {sub && <p className="mt-0.5 text-xs text-card-muted">{sub}</p>}
    </div>
  );
}

function Th({ children }: Readonly<{ children: React.ReactNode }>) {
  return <th className="px-4 py-2 text-left text-xs font-medium text-muted">{children}</th>;
}

function Td({ children, className = '' }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <td className={`whitespace-nowrap px-4 py-3 text-sm text-foreground ${className}`}>{children}</td>;
}
