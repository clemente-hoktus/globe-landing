export function DashboardGerencialPage() {
  return (
    <div style={{ padding: '15px 20px', minHeight: '100%', overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            style={{
              height: '34px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-muted)',
              fontSize: '13px',
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 12px',
              cursor: 'pointer',
            }}
          >
            Últimos 30 días
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#727C78" strokeWidth="1.5" strokeLinecap="round"><path d="M1 1l4 4 4-4" /></svg>
          </button>
          <button
            type="button"
            style={{
              height: '34px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-primary-btn)',
              color: 'var(--color-primary-btn-fg)',
              fontSize: '13px',
              fontWeight: 600,
              padding: '0 16px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Exportar
          </button>
        </div>
      </div>
      <p style={{ marginTop: '7px', fontWeight: 400, color: 'var(--color-muted)', fontSize: '13px' }}>Vista general del consumo</p>

      <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
        {[
          { label: 'Consumo total', value: '482.300', unit: 'kWh', change: '+2.4%', vsLabel: true },
          { label: 'Costo Energético', value: '$ 36.640.000', unit: '', change: '-1.2%', vsLabel: true },
          { label: 'Demanda máxima', value: '1.240', unit: 'kW', change: '+15', vsLabel: false },
          { label: 'Alertas activas', value: '7', unit: '', change: '+3', vsLabel: false },
        ].map((kpi, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              minWidth: 0,
              height: '118px',
              backgroundColor: 'var(--color-card)',
              borderRadius: '6px',
              border: '1px solid var(--color-card-border)',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <span style={{ fontSize: '12.5px', fontWeight: 400, color: 'var(--color-card-muted)' }}>{kpi.label}</span>
            <span style={{ fontSize: 'clamp(18px, 2.2vw, 27px)', fontWeight: 700, color: 'var(--color-card-fg)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{kpi.value}{kpi.unit && <span style={{ fontSize: '13px', fontWeight: 400, color: 'var(--color-card-muted)', marginLeft: '4px' }}>{kpi.unit}</span>}</span>
            {kpi.change ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: kpi.change.startsWith('+') ? '#57C57F' : '#d05050',
                  backgroundColor: kpi.change.startsWith('+') ? '#57C57F1A' : '#d050501A',
                  borderRadius: '999px',
                  width: '74px',
                  height: '22px',
                }}>{kpi.change}</span>
                {kpi.vsLabel && <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--color-card-muted)' }}>vs mes ant.</span>}
              </div>
            ) : <span />}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '10px', height: '300px' }}>
        <div style={{
          flex: 63,
          minWidth: 0,
          backgroundColor: 'var(--color-card)',
          borderRadius: '6px',
          border: '1px solid var(--color-card-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '14px',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', flexShrink: 0 }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-card-fg)', display: 'block' }}>Consumo energético</span>
              <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--color-card-muted)' }}>kWh · últimos 12 meses</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#9FD838' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#9FD838', display: 'inline-block' }} />2026</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--color-card-muted)' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8C9993', display: 'inline-block' }} />2025</span>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: 'calc(100% - 20px)' }}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9FD838" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#9FD838" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d="M0,22 C9,18 18,13 27,10 C36,7 45,4 54,3 C63,4 72,7 81,12 C90,17 96,22 100,25" fill="none" stroke="#8C9993" strokeWidth="0.4" strokeDasharray="1.5 1" vectorEffect="non-scaling-stroke" />
              <path d="M0,26 C9,22 18,16 27,12 C36,8 45,5 54,4 C63,5 72,10 81,16 C90,22 96,27 100,30 L100,35 L0,35 Z" fill="url(#areaFill)" />
              <path d="M0,26 C9,22 18,16 27,12 C36,8 45,5 54,4 C63,5 72,10 81,16 C90,22 96,27 100,30" fill="none" stroke="#9FD838" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', height: '20px', alignItems: 'center' }}>
              {['E','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => (
                <span key={m + i} style={{ fontSize: '10px', color: 'var(--color-card-muted)', textAlign: 'center', flex: 1 }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{
          flex: 37,
          minWidth: 0,
          backgroundColor: 'var(--color-card)',
          borderRadius: '6px',
          border: '1px solid var(--color-card-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '14px',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-card-fg)', display: 'block' }}>Consumo por zona</span>
          <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--color-card-muted)', marginBottom: '12px' }}>% del total del mes</span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px' }}>
            {[
              { label: 'Climatización (HVAC)', pct: 34, color: '#9FD838' },
              { label: 'Tiendas', pct: 28, color: '#6BA015' },
              { label: 'Iluminación', pct: 19, color: '#57C57F' },
              { label: 'Estacionamiento', pct: 12, color: '#3B8A5A' },
              { label: 'Áreas comunes', pct: 8, color: '#26664A' },
            ].map((z) => (
              <div key={z.label}>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)', display: 'block', marginBottom: '5px' }}>{z.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: 'var(--color-card-border)' }}>
                    <div style={{ width: `${z.pct}%`, height: '100%', borderRadius: '3px', backgroundColor: z.color }} />
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--color-card-fg)', fontWeight: 600, minWidth: '32px', textAlign: 'right' }}>{z.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{
        width: '100%',
        minHeight: '180px',
        marginTop: '10px',
        marginBottom: '15px',
        backgroundColor: 'var(--color-card)',
        borderRadius: '6px',
        border: '1px solid var(--color-card-border)',
        overflow: 'auto',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-card-fg)' }}>Alertas recientes</span>
          <span style={{ fontSize: '12px', fontWeight: 500, color: '#9FD838', cursor: 'pointer' }}>Ver todas</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-card-border)' }}>
              {['EQUIPO / ZONA', 'TIPO', 'SEVERIDAD', 'HACE', 'ESTADO'].map((col) => (
                <th key={col} style={{ padding: '6px 10px 6px 0', textAlign: 'left', fontWeight: 600, fontSize: '10px', color: 'var(--color-card-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { equipo: 'Chiller 03 · HVAC', tipo: 'Sobreconsumo', sev: 'Crítica', sevColor: '#d05050', hace: '8 min', estado: 'Activa', estColor: '#57C57F' },
              { equipo: 'Tablero T-12 · Tiendas', tipo: 'Fuera de rango', sev: 'Alta', sevColor: '#e88930', hace: '24 min', estado: 'Activa', estColor: '#57C57F' },
              { equipo: 'Medidor Z4 · Estac.', tipo: 'Sin lectura', sev: 'Media', sevColor: '#4a6ee0', hace: '1 h', estado: 'En revisión', estColor: '#e88930' },
            ].map((a, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                <td style={{ padding: '8px 10px 8px 0', color: 'var(--color-muted)' }}>{a.equipo}</td>
                <td style={{ padding: '8px 10px 8px 0', color: 'var(--color-card-muted)' }}>{a.tipo}</td>
                <td style={{ padding: '8px 10px 8px 0' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 500, color: a.sevColor }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: a.sevColor }} />{a.sev}
                  </span>
                </td>
                <td style={{ padding: '8px 10px 8px 0', color: 'var(--color-card-muted)' }}>{a.hace}</td>
                <td style={{ padding: '8px 10px 8px 0', color: a.estColor, fontWeight: 500, fontSize: '12px' }}>{a.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
