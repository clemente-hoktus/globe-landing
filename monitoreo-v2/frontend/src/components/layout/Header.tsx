import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { useClickOutside } from '../../hooks/useClickOutside';

const BREADCRUMB_MAP: Record<string, string> = {
  '/calidad/datos': 'Calidad de Datos',
  '/calidad/cuadratura': 'Cuadratura de Agregación',
  '/auditoria/pista': 'Pista de Auditoría',
  '/auditoria/trazabilidad-cnr': 'Trazabilidad CNR',
  '/auditoria/cambios-maestro': 'Cambios en Maestro',
  '/auditoria/acceso-permisos': 'Acceso y Permisos',
  '/gerencial/dashboard': 'Dashboard',
  '/gerencial/consumo': 'Consumo',
  '/gerencial/equipos-zonas': 'Equipos y Zonas',
  '/gerencial/alertas': 'Alertas',
  '/gerencial/auditoria': 'Auditoría',
  '/gerencial/reportes': 'Reportes',
};
export function Header() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumb = BREADCRUMB_MAP[location.pathname];
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark' || (!document.documentElement.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches));
  const workProfile = useAppStore((s) => s.workProfile);
  const setWorkProfile = useAppStore((s) => s.setWorkProfile);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside([btnRef, menuRef], () => setMenuOpen(false), menuOpen);

  const initials = (user?.displayName ?? user?.email ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-3 bg-sidebar text-sidebar-fg px-4">
      <div className="flex items-center gap-2.5" style={{ width: sidebarOpen ? '240px' : '56px' }}>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: '#9FD838' }}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="#062C23" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
        </div>
        {sidebarOpen && <span className="text-sm font-semibold text-sidebar-fg truncate">POWER Digital</span>}
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => navigate('/')} className="flex items-center gap-1 rounded-lg px-1 py-1 text-sidebar-muted transition-colors hover:text-sidebar-fg hover:bg-sidebar-hover shrink-0">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          {breadcrumb && workProfile === 'Gerencial' && <span className="text-xs">Inicio</span>}
        </button>
        {breadcrumb && (
          <>
            <span className="text-sidebar-muted text-xs">/</span>
            <span className={`text-sidebar-fg text-xs ${workProfile === 'Gerencial' ? 'font-bold' : 'font-medium'}`}>{breadcrumb}</span>
          </>
        )}
      </div>
      <div className="flex-1" />
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 'min(636px, 40vw)' }}>
        <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#505955" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        <input
          type="text"
          placeholder="Buscar medidor, sitio, alarma..."
          style={{
            width: '100%',
            height: '40px',
            borderRadius: '6px',
            border: '1px solid #505955',
            backgroundColor: 'transparent',
            color: '#C6CFCB',
            fontSize: '13px',
            fontWeight: 400,
            paddingLeft: '30px',
            paddingRight: '12px',
            outline: 'none',
          }}
        />
      </div>

      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-muted transition-colors hover:text-sidebar-fg hover:bg-sidebar-hover shrink-0">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
      </button>

      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-muted transition-colors hover:text-sidebar-fg hover:bg-sidebar-hover shrink-0">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
      </button>

      <span style={{ color: '#505955', fontSize: '20px', fontWeight: 300 }}>|</span>

      {/* User menu */}
      <div className="relative">
        <button
          ref={btnRef}
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-foreground transition-colors hover:bg-surface"
        >
          <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: '32px', height: '32px', backgroundColor: '#083F32', color: '#9FD838', fontWeight: 700, fontSize: '12px' }}>
            {initials}
          </span>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#F6F8F7' }}>{user?.displayName ?? 'Usuario'}</span>
            <span style={{ fontSize: '11px', fontWeight: 400, color: '#9EA9A4' }}>{workProfile}</span>
          </div>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#727C78" strokeWidth="1.5" strokeLinecap="round" className="hidden sm:block"><path d="M1 1l4 4 4-4" /></svg>
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border border-border bg-background py-1 shadow-float"
          >
            <button
              type="button"
              onClick={() => { setMenuOpen(false); navigate('/profile'); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-surface"
            >
              Perfil
            </button>
            <button
              type="button"
              onClick={() => { setMenuOpen(false); navigate('/admin/settings'); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-surface"
            >
              Configuracion
            </button>
            <div style={{ borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />
            <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">Modo de trabajo</div>
            {['Auditoría', 'Gerencial'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { setWorkProfile(p); setMenuOpen(false); navigate('/'); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-surface"
              >
                {p === workProfile && <span style={{ color: '#9FD838', fontSize: '10px' }}>●</span>}
                <span style={{ marginLeft: p === workProfile ? 0 : '14px' }}>{p}</span>
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--color-border)', margin: '4px 0' }} />
            <button
              type="button"
              onClick={() => {
                const next = isDark ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                setIsDark(!isDark);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-surface"
            >
              {isDark ? (
                <><svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg> Modo claro</>
              ) : (
                <><svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg> Modo oscuro</>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
