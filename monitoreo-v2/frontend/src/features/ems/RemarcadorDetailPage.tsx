import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { REMARCADORES } from './mock-data';
import { StatusBadge } from './StatusBadge';
import { StockChart } from '../../components/charts/StockChart';

function fmt(n: number, d = 0): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d });
}

type Metric = 'consumo' | 'potencia' | 'potenciaPeak' | 'voltaje' | 'factorPotencia' | 'corriente';

const METRICS: { key: Metric; label: string; unit: string; decimals: number }[] = [
  { key: 'consumo', label: 'Consumo', unit: 'kWh', decimals: 1 },
  { key: 'potencia', label: 'Potencia prom.', unit: 'kW', decimals: 2 },
  { key: 'potenciaPeak', label: 'Potencia peak', unit: 'kW', decimals: 2 },
  { key: 'voltaje', label: 'Voltaje prom.', unit: 'V', decimals: 1 },
  { key: 'factorPotencia', label: 'Factor potencia', unit: '', decimals: 3 },
  { key: 'corriente', label: 'Corriente prom.', unit: 'A', decimals: 1 },
];

function mockMetricData(base: number[], metric: Metric): number[] {
  const max = Math.max(...base, 1);
  const norm = base.map((v) => v / max);

  const generators: Record<Metric, (n: number, i: number) => number> = {
    consumo: (n, _i) => n * max,
    potencia: (n, i) => {
      const baseKw = n * 185;
      return baseKw + Math.sin(i * 0.4) * 12;
    },
    potenciaPeak: (n, i) => {
      const baseKw = n * 210;
      const spike = (i >= 15 && i <= 17) ? 45 : 0;
      return baseKw + spike + Math.sin(i * 0.6) * 8;
    },
    voltaje: (_n, i) => {
      if (base[i] === 0) return 0;
      const baseV = 381;
      const sag = (i >= 9 && i <= 11) ? -6 : 0;
      const ripple = Math.sin(i * 0.8) * 3.5 + Math.cos(i * 1.3) * 2;
      return baseV + sag + ripple;
    },
    factorPotencia: (n, i) => {
      if (n === 0) return 0;
      const basePf = 0.94;
      const loadDrop = n > 0.7 ? -0.04 : n < 0.2 ? -0.08 : 0;
      return basePf + loadDrop + Math.sin(i * 0.5) * 0.02;
    },
    corriente: (n, i) => {
      const baseA = n * 48;
      const imbalance = Math.sin(i * 0.7) * 3;
      return baseA + imbalance;
    },
  };

  return norm.map((n, i) => {
    const val = generators[metric](n, i);
    return Math.max(0, val);
  });
}

export function RemarcadorDetailPage() {
  const { remarcadorId } = useParams<{ remarcadorId: string }>();
  const navigate = useNavigate();
  const rem = REMARCADORES.find((r) => r.id === remarcadorId);
  const [selectedMetric, setSelectedMetric] = useState<Metric>('consumo');

  if (!rem) return <div className="flex h-full items-center justify-center text-sm text-muted">Remarcador no encontrado.</div>;

  const chartData = mockMetricData(rem.consumoHoy, selectedMetric);
  const meta = METRICS.find((m) => m.key === selectedMetric)!;
  const lastValue = chartData.filter((v) => v > 0).pop() ?? 0;
  const avgValue = chartData.filter((v) => v > 0).reduce((s, v, _, a) => s + v / a.length, 0);
  const maxValue = Math.max(...chartData);

  const stockOptions = useMemo(() => {
    const today = new Date(2026, 8, 16);
    today.setHours(0, 0, 0, 0);
    const baseTs = today.getTime();
    const seriesData: [number, number][] = [];
    for (let h = 0; h < 24; h++) {
      const hourly = chartData[h] ?? 0;
      for (let m = 0; m < 4; m++) {
        const ts = baseTs + (h * 60 + m * 15) * 60000;
        const jitter = hourly > 0 ? (Math.sin(h * 3 + m) * hourly * 0.05) : 0;
        seriesData.push([ts, Math.max(0, hourly + jitter)]);
      }
    }
    return {
      series: [{
        type: 'areaspline' as const,
        name: meta.label,
        data: seriesData,
        tooltip: { valueSuffix: meta.unit ? ` ${meta.unit}` : '', valueDecimals: meta.decimals },
        fillOpacity: 0.15,
        lineWidth: 2,
        color: 'var(--color-accent)',
      }],
      yAxis: { title: { text: meta.unit || meta.label } },
      rangeSelector: {
        buttons: [
          { type: 'hour' as const, count: 3, text: '3h' },
          { type: 'hour' as const, count: 6, text: '6h' },
          { type: 'hour' as const, count: 12, text: '12h' },
          { type: 'all' as const, text: '24h' },
        ],
        selected: 3,
      },
    };
  }, [chartData, meta]);

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden p-6">
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <button type="button" onClick={() => navigate('/remarcadores')} className="flex items-center gap-1 text-xs text-muted hover:text-foreground">
            ← Volver a Remarcadores
          </button>
          <h1 className="mt-1 font-mono text-lg font-bold text-foreground">{rem.code}</h1>
          <div className="mt-1 flex flex-wrap gap-2">
            <StatusBadge estado={rem.estado} />
            <Tag>{rem.modelo}</Tag>
            <Tag>{rem.centroName}</Tag>
          </div>
        </div>
        <button type="button" onClick={() => navigate(`/centros/${rem.centroId}`)} className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground hover:bg-raised">
          Ir al centro
        </button>
      </div>

      <div className="grid shrink-0 grid-cols-3 gap-3 lg:grid-cols-6">
        <KpiCard label="Potencia actual" value={fmt(lastValue * 0.85, 1)} unit="kW" />
        <KpiCard label="Energía hoy" value={fmt(rem.consumoHoy.reduce((s, v) => s + v, 0))} unit="kWh" />
        <KpiCard label="Voltaje L1" value={fmt(382.4, 1)} unit="V" />
        <KpiCard label="Corriente" value={fmt(lastValue * 0.0045, 1)} unit="A" />
        <KpiCard label="Factor potencia" value={fmt(0.92, 3)} />
        <KpiCard label="Peak hoy" value={fmt(maxValue * 1.15, 1)} unit="kW" />
      </div>

      <div className="shrink-0">
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value as Metric)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground"
        >
          {METRICS.map((m) => (
            <option key={m.key} value={m.key}>{m.label} ({m.unit || '—'})</option>
          ))}
        </select>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-5">
        <div className="flex flex-col rounded-xl border border-card-border bg-card lg:col-span-3">
          <div className="flex shrink-0 items-start justify-between px-4 pt-4">
            <div>
              <h2 className="text-sm font-semibold text-card-fg">{meta.label} · hoy</h2>
              <p className="text-xs text-card-muted">{rem.code} — cada 15 min</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg font-bold text-card-fg tabular-nums">{fmt(lastValue, meta.decimals)} <span className="text-xs font-normal text-card-muted">{meta.unit}</span></p>
              <p className="text-[10px] text-card-muted">prom: {fmt(avgValue, meta.decimals)} · max: {fmt(maxValue, meta.decimals)}</p>
            </div>
          </div>
          <div className="min-h-0 flex-1">
            <StockChart options={stockOptions} className="h-full" />
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2 overflow-y-auto">
          <div className="rounded-xl border border-card-border bg-card p-4">
            <h2 className="text-sm font-semibold text-card-fg">Estado del dispositivo</h2>
            <div className="mt-3 space-y-2">
              <FichaRow label="Conexión" value={rem.estado === 'conectado' ? 'Conectado' : rem.estado === 'sin_senal' ? 'Sin señal' : 'Caído'} />
              <FichaRow label="Señal" value={`${rem.signal}%`} icon={<SignalIcon signal={rem.signal} />} />
              <FichaRow label="Última lectura" value={`${rem.ultimaLectura} · hace 2 min`} />
              <FichaRow label="Firmware" value="4.2.1" />
              <FichaRow label="Instalado" value="2025-03-12" />
              <FichaRow label="Centro" value={rem.centroName} />
              <FichaRow label="IP" value="10.0.1.42" />
              <FichaRow label="Modbus addr." value="0x01" />
              <FichaRow label="Fase" value="Trifásico" />
              <FichaRow label="V nominal" value="380 V" />
              <FichaRow label="I nominal" value="100 A" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, unit }: Readonly<{ label: string; value: string; unit?: string }>) {
  return (
    <div className="rounded-xl border border-card-border bg-card px-3 py-2.5">
      <p className="text-[11px] text-card-muted">{label}</p>
      <p className="mt-0.5 font-mono text-base font-bold text-card-fg tabular-nums">
        {value}{unit && <span className="ml-0.5 text-xs font-normal text-card-muted">{unit}</span>}
      </p>
    </div>
  );
}

function Tag({ children }: Readonly<{ children: React.ReactNode }>) {
  return <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">{children}</span>;
}

function FichaRow({ label, value, icon }: Readonly<{ label: string; value: string; icon?: React.ReactNode }>) {
  return (
    <div className="flex items-center justify-between border-b border-card-border pb-2 last:border-0">
      <span className="text-xs text-card-muted">{label}</span>
      <span className="flex items-center gap-1.5 font-mono text-xs font-medium text-card-fg">{icon}{value}</span>
    </div>
  );
}

function SignalIcon({ signal }: Readonly<{ signal: number }>) {
  const bars = signal >= 75 ? 4 : signal >= 50 ? 3 : signal >= 25 ? 2 : signal > 0 ? 1 : 0;
  const color = bars >= 3 ? 'var(--color-success)' : bars >= 2 ? 'var(--color-warning)' : 'var(--color-danger)';
  return (
    <span className="inline-flex items-end gap-0.5">
      {[1, 2, 3, 4].map((b) => (
        <span key={b} className="w-0.5 rounded-sm" style={{ height: `${b * 2 + 2}px`, backgroundColor: b <= bars ? color : 'var(--color-border)' }} />
      ))}
    </span>
  );
}
