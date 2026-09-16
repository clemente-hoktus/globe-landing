import { useState, useCallback, useEffect, type ReactElement } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { startAuthentication } from '@simplewebauthn/browser';
import { useSearchParams, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/auth/useAuth';
import { clearSessionFlag } from '../../hooks/auth/useSessionResolver';
import { authEndpoints } from '../../services/endpoints';
import { clearDevBearerToken } from '../../services/api';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    loginMicrosoft, loginGoogle, error, isLoading,
    mfaPending, validateMfa,
    mfaSetupData, regenerateMfaSetup, verifyMfaSetup, finishMfaSetupAfterRecovery,
    mfaRecoveryCodes,
    handleSsoCallbackParams,
  } = useAuth();

  const [mfaCode, setMfaCode] = useState('');
  const [setupCode, setSetupCode] = useState('');
  const [ssoCallbackHandled, setSsoCallbackHandled] = useState(false);
  const [passkeyMode, setPasskeyMode] = useState(false);
  const [passkeyEmail, setPasskeyEmail] = useState('');
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = document.documentElement.getAttribute('data-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    clearSessionFlag();
    clearDevBearerToken();
    void authEndpoints.clearSessionCookies();
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    return () => { document.documentElement.removeAttribute('data-theme'); };
  }, [theme]);

  useEffect(() => {
    if (ssoCallbackHandled) return;
    const hasCallbackParams =
      searchParams.get('mfaRequired') === '1' || searchParams.get('mfaSetupRequired') === '1';
    if (!hasCallbackParams) return;

    setSsoCallbackHandled(true);
    void handleSsoCallbackParams(searchParams).then((handled) => {
      if (handled) {
        navigate('/login', { replace: true });
      }
    });
  }, [searchParams, handleSsoCallbackParams, navigate, ssoCallbackHandled]);

  const handlePasskeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkeyEmail.trim()) return;
    setPasskeyError(null);
    setPasskeyLoading(true);
    try {
      const { data: options } = await authEndpoints.webauthnLoginOptions(passkeyEmail.trim());
      const { userId, ...authOptions } = options;
      const assertion = await startAuthentication({ optionsJSON: authOptions as Parameters<typeof startAuthentication>[0]['optionsJSON'] });
      await authEndpoints.webauthnLoginVerify(userId, assertion);
      window.location.href = '/';
    } catch (err: unknown) {
      const axiosMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPasskeyError(axiosMsg ?? (err instanceof Error ? err.message : 'Error en autenticación biométrica'));
    } finally {
      setPasskeyLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: useCallback((response: { access_token: string }) => {
      loginGoogle(response.access_token);
    }, [loginGoogle]),
  });

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length === 6) validateMfa(mfaCode);
  };

  const handleSetupVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (setupCode.length === 6) verifyMfaSetup(setupCode);
  };

  const subtitle = mfaSetupData
    ? 'Configura tu autenticación de dos factores'
    : mfaPending
      ? 'Ingresa tu código de verificación'
      : passkeyMode
        ? 'Ingresa tu correo para autenticarte con biométrico'
        : 'Ingresa con tu cuenta corporativa.';

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[40%] shrink-0 flex-col justify-between overflow-hidden p-10 lg:flex" style={{ backgroundColor: '#212826' }}>
        <div className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] translate-x-1/3 translate-y-1/4 rounded-full" style={{ border: '1.4px solid #6BA015', opacity: 0.25 }} />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[540px] w-[540px] translate-x-1/3 translate-y-1/4 rounded-full" style={{ border: '1.4px solid #6BA015', opacity: 0.15 }} />

        <div className="relative flex items-center gap-3">
          <PowerDigitalLogo />
          <span className="text-lg font-semibold text-white">POWER Digital</span>
        </div>

        <div className="relative space-y-6">
          <h1 className="max-w-md text-[2.5rem] font-semibold leading-[1.1] tracking-tight text-white">
            Gestión energética inteligente para Parque Arauco
          </h1>
          <div className="h-1 w-16 rounded-full" style={{ backgroundColor: '#6BA015' }} />
          <p className="max-w-md text-sm leading-relaxed text-white/60">
            Monitorea, controla y audita el consumo energético en tiempo real, en un solo lugar.
          </p>
        </div>

        <div className="relative space-y-1 text-xs text-white/40">
          <p>© 2026 Globe Power SpA</p>
          <p>POWER Digital® EMS · Parque Arauco</p>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center bg-background px-6 py-10">
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-raised"
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <PowerDigitalLogo />
            <span className="text-lg font-semibold text-foreground">POWER Digital</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Iniciar sesión</h2>
            <p className="mt-2 text-sm text-muted">{subtitle}</p>
          </div>

          {error && (
            <div className="rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm text-danger">{error}</div>
          )}

          {mfaRecoveryCodes ? (
            <RecoveryCodesPanel
              codes={mfaRecoveryCodes}
              onContinue={() => void finishMfaSetupAfterRecovery()}
            />
          ) : mfaSetupData ? (
            <MfaSetupForm
              qrDataUrl={mfaSetupData.qrDataUrl}
              secret={mfaSetupData.secret}
              setupCode={setupCode}
              onSetupCodeChange={setSetupCode}
              onRegenerate={() => {
                setSetupCode('');
                void regenerateMfaSetup();
              }}
              onSubmit={handleSetupVerify}
              isLoading={isLoading}
            />
          ) : mfaPending ? (
            <MfaVerifyForm
              mfaCode={mfaCode}
              onMfaCodeChange={setMfaCode}
              onSubmit={handleMfaSubmit}
              isLoading={isLoading}
            />
          ) : passkeyMode ? (
            <PasskeyLoginForm
              email={passkeyEmail}
              onEmailChange={setPasskeyEmail}
              onSubmit={handlePasskeyLogin}
              onBack={() => { setPasskeyMode(false); setPasskeyError(null); }}
              isLoading={passkeyLoading}
              error={passkeyError}
            />
          ) : (
            <OAuthPanel
              isLoading={isLoading}
              onMicrosoft={loginMicrosoft}
              onGoogle={() => googleLogin()}
              onPasskey={() => setPasskeyMode(true)}
            />
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">¿Problemas para acceder?</span>
            <a href="mailto:soporte@globepower.cl" className="font-medium hover:underline" style={{ color: '#6BA015' }}>
              Contacta a soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const PRIMARY_BTN = 'w-full rounded-lg px-4 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 bg-primary-btn text-primary-btn-fg';
const SECONDARY_BTN = 'flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-background px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-surface disabled:opacity-50';

interface OAuthPanelProps {
  isLoading: boolean;
  onMicrosoft: () => void;
  onGoogle: () => void;
  onPasskey: () => void;
}

function OAuthPanel({ isLoading, onMicrosoft, onGoogle, onPasskey }: Readonly<OAuthPanelProps>) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onMicrosoft} disabled={isLoading} className={PRIMARY_BTN}>
        <span className="flex items-center justify-center gap-2.5">
          <MicrosoftIcon />
          Continuar con Microsoft
        </span>
      </button>

      <button type="button" onClick={onGoogle} disabled={isLoading} className={SECONDARY_BTN}>
        <GoogleIcon />
        Continuar con Google
      </button>

      <div className="relative flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-border" />
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-[10px] text-muted">o</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button type="button" onClick={onPasskey} disabled={isLoading} className={SECONDARY_BTN}>
        <PasskeyIcon />
        Iniciar con passkey
      </button>
    </div>
  );
}

interface PasskeyLoginFormProps {
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

function PasskeyLoginForm({ email, onEmailChange, onSubmit, onBack, isLoading, error }: Readonly<PasskeyLoginFormProps>) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Correo electrónico</label>
        <input
          type="email"
          autoFocus
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="nombre@empresa.cl"
          className="input-field"
        />
      </div>
      {error && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-foreground">
          <p className="font-medium">{error}</p>
          {error.includes('passkeys registradas') && (
            <p className="mt-1.5 text-xs text-muted">
              Inicia sesión con Microsoft o Google, luego ve a <strong>Perfil → Passkeys</strong> para registrar tu huella o Face ID.
            </p>
          )}
        </div>
      )}
      <button type="submit" disabled={isLoading || !email.trim()} className={PRIMARY_BTN}>
        {isLoading ? 'Verificando...' : 'Continuar con biométrico'}
      </button>
      <button type="button" onClick={onBack} className={SECONDARY_BTN}>
        Volver a opciones de inicio
      </button>
    </form>
  );
}

interface MfaVerifyFormProps {
  mfaCode: string;
  onMfaCodeChange: (code: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

function MfaVerifyForm({ mfaCode, onMfaCodeChange, onSubmit, isLoading }: Readonly<MfaVerifyFormProps>) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Código de autenticación (6 dígitos)
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          autoFocus
          value={mfaCode}
          onChange={(e) => onMfaCodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="input-field text-center font-mono text-xl tracking-[0.3em]"
        />
      </div>
      <button type="submit" disabled={isLoading || mfaCode.length !== 6} className={PRIMARY_BTN}>
        {isLoading ? 'Verificando...' : 'Verificar'}
      </button>
      <p className="text-center text-xs text-muted">
        Abre tu app de autenticación y copia el código de 6 dígitos.
      </p>
    </form>
  );
}

interface MfaSetupFormProps {
  qrDataUrl: string;
  secret: string;
  setupCode: string;
  onSetupCodeChange: (code: string) => void;
  onRegenerate: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

function MfaSetupForm({ qrDataUrl, secret, setupCode, onSetupCodeChange, onRegenerate, onSubmit, isLoading }: Readonly<MfaSetupFormProps>) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-3 rounded-lg border border-border bg-surface p-4">
        <p className="text-sm font-semibold text-foreground">Escanea el código QR</p>
        <p className="text-xs text-muted">
          Funciona igual en local y en producción: la app solo usa el código de 6 dígitos, no la URL del sitio.
          Borra entradas viejas de &quot;EnergyMonitor&quot; antes de escanear.
        </p>
        <div className="flex justify-center rounded-lg bg-background p-3">
          <img key={secret} src={qrDataUrl} alt="Código QR para MFA" className="h-44 w-44" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted">Clave manual (si el QR falla)</p>
          <code className="block break-all rounded-lg bg-raised px-2 py-1 font-mono text-xs text-foreground">
            {secret}
          </code>
        </div>
        <button type="button" onClick={onRegenerate} disabled={isLoading} className="text-xs text-foreground hover:underline disabled:opacity-50">
          Generar nuevo QR
        </button>
      </div>
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        autoFocus
        value={setupCode}
        onChange={(e) => onSetupCodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        placeholder="000000"
        className="input-field text-center font-mono text-xl tracking-[0.3em]"
      />
      <button type="submit" disabled={isLoading || setupCode.length !== 6} className={PRIMARY_BTN}>
        {isLoading ? 'Verificando...' : 'Activar y continuar'}
      </button>
    </form>
  );
}

interface RecoveryCodesPanelProps {
  codes: string[];
  onContinue: () => void;
}

function RecoveryCodesPanel({ codes, onContinue }: Readonly<RecoveryCodesPanelProps>) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-success/30 bg-success/5 p-4">
        <p className="text-sm font-semibold text-foreground">MFA activado correctamente</p>
        <p className="mt-1 text-xs text-muted">Guarda estos códigos en un lugar seguro.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {codes.map((code) => (
          <code key={code} className="rounded-lg bg-surface px-2 py-1.5 text-center font-mono text-xs text-foreground">
            {code}
          </code>
        ))}
      </div>
      <button type="button" onClick={onContinue} className={PRIMARY_BTN}>
        Ya los guardé, entrar a la plataforma
      </button>
    </div>
  );
}

function SunIcon(): ReactElement {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon(): ReactElement {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function PowerDigitalLogo(): ReactElement {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#6BA015' }}>
      <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    </div>
  );
}

function PasskeyIcon(): ReactElement {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 11c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3Z" />
      <path d="M15 21v-4l2-2" />
      <path d="M15 17h2" />
      <path d="M9 14v7" />
      <path d="M5 14h8" />
    </svg>
  );
}

function MicrosoftIcon(): ReactElement {
  return (
    <svg className="h-5 w-5" viewBox="0 0 21 21" aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}

function GoogleIcon(): ReactElement {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
