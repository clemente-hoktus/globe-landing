import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAppStore } from '../../store/useAppStore';
import { useAuth } from '../../hooks/auth/useAuth';
import { NavModuleIcon } from './sidebar-icons';
import { SidebarReveal } from './sidebar-motion';

function SidebarSection({ label, expanded }: { label: string; expanded: boolean }) {
  return (
    <SidebarReveal show={expanded}>
      <div className="mb-1 px-3 uppercase tracking-[0.08em]" style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-sidebar-muted)' }}>
        {label}
      </div>
    </SidebarReveal>
  );
}

function NavItem({ label, path, currentPath, onNavigate }: { label: string; path: string; currentPath: string; onNavigate: (to: string) => void }) {
  const isActive = currentPath === path || currentPath.startsWith(path + '/');
  return (
    <button
      type="button"
      onClick={() => onNavigate(path)}
      className="w-full rounded-md py-2 text-left transition-colors block"
      style={{
        fontSize: '13px',
        fontWeight: isActive ? 500 : 400,
        color: isActive ? 'var(--color-sidebar-fg)' : 'var(--color-sidebar-muted)',
        paddingLeft: '1.05rem',
        paddingRight: '0.75rem',
        backgroundColor: isActive ? '#9FD8381F' : 'transparent',
        borderLeft: isActive ? '3px solid #9FD838' : '3px solid transparent',
      }}
    >
      {label}
    </button>
  );
}

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, workProfile } = useAppStore();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const expanded = sidebarOpen;

  useEffect(() => {
    if (window.innerWidth < 1366 && sidebarOpen) {
      useAppStore.getState().setSidebarOpen(false);
    }
  }, []);

  const navItemClass = (isActive: boolean): string => {
    const layout = expanded ? 'gap-2.5 px-3 py-2 text-left text-sm' : 'justify-center gap-0 px-2.5 py-2.5';
    const color = isActive
      ? 'bg-[var(--color-sidebar-active)] text-[var(--color-sidebar-fg)] font-medium'
      : 'text-[var(--color-sidebar-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-sidebar-fg)]';
    return `flex w-full items-center rounded-lg transition-all duration-200 ease-out ${layout} ${color}`;
  };

  return (
    <aside
      className={`group/sidebar relative flex h-full min-h-0 shrink-0 flex-col overflow-visible bg-[var(--color-sidebar)] transition-[width] duration-300 ease-in-out motion-reduce:transition-none ${
        expanded ? 'w-[240px]' : 'w-14'
      }`}
    >
      {/* Edge toggle — always visible chevron on sidebar border */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={expanded ? 'Colapsar menú' : 'Expandir menú'}
        className="absolute -right-3 top-5 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted shadow-sm transition-colors duration-200 hover:bg-surface hover:text-foreground"
      >
        <svg className={`h-3 w-3 transition-transform duration-300 ${expanded ? '' : 'rotate-180'}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 2L4 6l4 4" />
        </svg>
      </button>

      {/* Nav */}
      <nav className={`min-h-0 flex-1 overflow-y-auto py-3 transition-[padding] duration-300 ease-in-out ${expanded ? 'px-2' : 'px-1.5'}`}>
        {workProfile === 'Auditoría' ? (
          <>
            <SidebarSection label="Calidad" expanded={expanded} />
            {expanded && (
              <div className="space-y-0.5">
                {[
                  { label: 'Calidad de Datos', path: '/calidad/datos' },
                  { label: 'Cuadratura de Agregación', path: '/calidad/cuadratura' },
                ].map((item) => (
                  <NavItem key={item.path} label={item.label} path={item.path} currentPath={location.pathname} onNavigate={navigate} />
                ))}
              </div>
            )}
            <div className="mt-6">
              <SidebarSection label="Auditoría" expanded={expanded} />
              {expanded && (
                <div className="space-y-0.5">
                  {[
                    { label: 'Pista de Auditoría', path: '/auditoria/pista' },
                    { label: 'Trazabilidad CNR', path: '/auditoria/trazabilidad-cnr' },
                    { label: 'Cambios en Maestro', path: '/auditoria/cambios-maestro' },
                    { label: 'Acceso y Permisos', path: '/auditoria/acceso-permisos' },
                  ].map((item) => (
                    <NavItem key={item.path} label={item.label} path={item.path} currentPath={location.pathname} onNavigate={navigate} />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <SidebarSection label="Principal" expanded={expanded} />
            {expanded && (
              <div className="space-y-0.5">
                {[
                  { label: 'Dashboard', path: '/gerencial/dashboard' },
                  { label: 'Consumo', path: '/gerencial/consumo' },
                  { label: 'Equipos y Zonas', path: '/gerencial/equipos-zonas' },
                ].map((item) => (
                  <NavItem key={item.path} label={item.label} path={item.path} currentPath={location.pathname} onNavigate={navigate} />
                ))}
              </div>
            )}
            <div className="mt-6">
              <SidebarSection label="Gestión" expanded={expanded} />
              {expanded && (
                <div className="space-y-0.5">
                  {[
                    { label: 'Alertas', path: '/gerencial/alertas' },
                    { label: 'Auditoría', path: '/gerencial/auditoria' },
                    { label: 'Reportes', path: '/gerencial/reportes' },
                  ].map((item) => (
                    <NavItem key={item.path} label={item.label} path={item.path} currentPath={location.pathname} onNavigate={navigate} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Logout */}
      <div className={`shrink-0 border-t border-[var(--color-sidebar-border)] transition-[padding] duration-300 ${expanded ? 'px-3 py-3' : 'px-1.5 py-2'}`}>
        <button type="button" onClick={logout} title="Cerrar sesión" className={navItemClass(false)}>
          <NavModuleIcon name="logout" className="h-[18px] w-[18px] shrink-0" />
          <SidebarReveal show={expanded}>
            <span className="flex-1 text-left text-xs">Cerrar Sesión</span>
          </SidebarReveal>
        </button>
      </div>
    </aside>
  );
}
