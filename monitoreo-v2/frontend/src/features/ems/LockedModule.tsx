export function LockedModule({ name }: Readonly<{ name: string }>) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-3xl">🔒</span>
        <h2 className="text-lg font-semibold text-foreground">{name}</h2>
        <p className="max-w-sm text-sm text-muted">
          Este módulo no está habilitado en tu cuenta. Contacta a tu ejecutivo comercial para activarlo.
        </p>
        <a href="mailto:ventas@globepower.cl" className="mt-2 rounded-lg px-4 py-2 text-xs font-medium" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}>
          Solicitar habilitación
        </a>
      </div>
    </div>
  );
}
