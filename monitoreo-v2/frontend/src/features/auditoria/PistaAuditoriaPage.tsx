export function PistaAuditoriaPage() {
  return (
    <div className="h-full" style={{ padding: '15px 20px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>Pista de Auditoría</h1>
        <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-subtle)' }}>Registros sellados</span>
      </div>
      <p style={{ marginTop: '7px', fontWeight: 400, color: 'var(--color-muted)', fontSize: '13px' }}>Registro inmutable de eventos del sistema · solo lectura</p>

      <div style={{ display: 'flex', gap: '10px', marginTop: '15px', alignItems: 'center' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <button
            key={i}
            type="button"
            style={{
              width: '158px',
              height: '39px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-muted)',
              fontSize: '13px',
              fontWeight: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              cursor: 'pointer',
            }}
          >
            <span>Entidad: <strong style={{ fontWeight: 500, color: 'var(--color-foreground)' }}>Medidor</strong></span>
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#727C78" strokeWidth="1.5" strokeLinecap="round"><path d="M1 1l4 4 4-4" /></svg>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ position: 'relative', width: '289px' }}>
          <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
          <input
            type="text"
            placeholder="Buscar medidor, sitio, alarma..."
            style={{
              width: '100%',
              height: '32px',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-muted)',
              fontSize: '13px',
              fontWeight: 400,
              paddingLeft: '30px',
              paddingRight: '12px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{
        marginTop: '15px',
        width: '100%',
        height: '64px',
        borderRadius: '6px',
        backgroundColor: '#23A9571F',
        border: '1px solid #57C57F',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}>
        <div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-foreground)', display: 'block' }}>Cadena de auditoría verificada</span>
          <span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-muted)', display: 'block', marginTop: '3px' }}>Integridad SHA-256 · retención 14 meses · 2.481 eventos</span>
        </div>
      </div>

      <div style={{
        marginTop: '10px',
        flex: 1,
        backgroundColor: 'var(--color-surface)',
        borderRadius: '6px',
        border: '1px solid var(--color-border)',
        overflow: 'auto',
        marginBottom: '15px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['TIMESTAMP', 'USUARIO', 'ENTIDAD', 'ID', 'ACCIÓN', 'CAMPO', 'ANTES → DESPUÉS', ''].map((col) => (
                <th key={col || 'actions'} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, fontSize: '11px', color: 'var(--color-subtle)', letterSpacing: '0.04em', textTransform: 'uppercase', width: col === '' ? '40px' : undefined }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '10px 14px', color: 'var(--color-muted)', fontFamily: 'monospace', fontSize: '12px' }}>09:42:11</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-muted)' }}>jsoto</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#F6F8F7', backgroundColor: 'transparent', border: '1px solid #F6F8F7', borderRadius: '999px', padding: '2px 8px' }}>Operativo</span>
                </td>
                <td style={{ padding: '10px 14px', color: 'var(--color-muted)', fontFamily: 'monospace', fontSize: '12px' }}>AL-1042</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-foreground)', backgroundColor: 'var(--color-action-badge)', borderRadius: '4px', padding: '2px 8px' }}>Editar</span>
                </td>
                <td style={{ padding: '10px 14px', color: 'var(--color-muted)' }}>Estado</td>
                <td style={{ padding: '10px 14px', color: 'var(--color-subtle)', fontSize: '12px' }}>Abierta → Asignada</td>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-subtle)' }}>
                    <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor"><circle cx="2" cy="2" r="1.5" /><circle cx="2" cy="8" r="1.5" /><circle cx="2" cy="14" r="1.5" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
