import { useState } from 'react';
import { STUDENT_ACCOUNTS, DRIVER_ACCOUNTS, ADMIN_ACCOUNTS } from '../store/appStore';
import type { AppStore } from '../store/appStore';

type Role = 'student' | 'driver' | 'admin';

interface Props {
  store: AppStore;
}

export default function LoginScreen({ store }: Props) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles: { id: Role; label: string; icon: string; desc: string }[] = [
    { id: 'student', label: 'Student', icon: '🎓', desc: 'View wallet, trip status & QR ID' },
    { id: 'driver', label: 'Driver', icon: '🚌', desc: 'Scan IDs, manage passengers' },
    { id: 'admin', label: 'Admin', icon: '⚙️', desc: 'Analytics, transactions & fleet' },
  ];

  function selectRole(role: Role) {
    setSelectedRole(role);
    setId('');
    setPassword('');
    setError('');
  }

  function fillDemo() {
    if (selectedRole === 'student') { setId('VIT2021001'); setPassword('student123'); }
    if (selectedRole === 'driver') { setId('DRV001'); setPassword('driver123'); }
    if (selectedRole === 'admin') { setId('ADM001'); setPassword('admin123'); }
    setError('');
  }

  function handleLogin() {
    if (!selectedRole || !id || !password) return;
    setLoading(true);
    setError('');
    setTimeout(() => {
      const ok = store.login(selectedRole, id.trim(), password);
      setLoading(false);
      if (!ok) setError('Invalid ID or password');
    }, 400);
  }

  const idPlaceholder =
    selectedRole === 'student' ? 'Student ID (e.g. VIT2021001)'
    : selectedRole === 'driver' ? 'Driver ID (e.g. DRV001)'
    : 'Admin ID (e.g. ADM001)';

  const demoHints =
    selectedRole === 'student'
      ? STUDENT_ACCOUNTS.map((a) => `${a.studentId} / student123`)
      : selectedRole === 'driver'
        ? DRIVER_ACCOUNTS.map((a) => `${a.driverId} / driver123`)
        : ADMIN_ACCOUNTS.map((a) => `${a.adminId} / admin123`);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'radial-gradient(ellipse at 30% 20%, #0F2040 0%, var(--background) 60%)' }}>

      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="flex items-center gap-3 justify-center mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            🚍
          </div>
          <span className="text-2xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            VIT SmartShuttle
          </span>
        </div>
        <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">
          Offline-first campus transit · Demo prototype
        </p>
      </div>

      {/* Role cards */}
      <div className="w-full max-w-sm space-y-3 mb-6">
        <p className="text-xs uppercase tracking-widest mb-4 text-center"
          style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
          Select your role
        </p>
        {roles.map((r) => (
          <button key={r.id} onClick={() => selectRole(r.id)}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all text-left"
            style={{
              background: selectedRole === r.id ? 'rgba(6,182,212,0.08)' : 'var(--card)',
              borderColor: selectedRole === r.id ? 'var(--primary)' : 'var(--border)',
            }}>
            <span className="text-2xl">{r.icon}</span>
            <div>
              <div className="font-semibold text-sm">{r.label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</div>
            </div>
            {selectedRole === r.id && (
              <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>✓</div>
            )}
          </button>
        ))}
      </div>

      {/* Credentials form */}
      {selectedRole && (
        <div className="w-full max-w-sm space-y-3 mb-5">
          <input
            type="text"
            value={id}
            onChange={(e) => { setId(e.target.value); setError(''); }}
            placeholder={idPlaceholder}
            className="w-full px-4 py-3 rounded-xl text-sm border"
            style={{ background: 'var(--card)', borderColor: error ? '#EF4444' : 'var(--border)', color: 'var(--foreground)' }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl text-sm border"
            style={{ background: 'var(--card)', borderColor: error ? '#EF4444' : 'var(--border)', color: 'var(--foreground)' }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          {error && (
            <p className="text-xs px-1" style={{ color: '#EF4444' }}>⚠ {error}</p>
          )}

          {/* Demo hint */}
          <div className="px-3 py-2 rounded-lg text-xs"
            style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', color: 'var(--muted-foreground)' }}>
            <span className="font-mono" style={{ color: '#06B6D4' }}>Demo accounts: </span>
            <button onClick={fillDemo} className="underline ml-1" style={{ color: '#06B6D4' }}>
              auto-fill
            </button>
            <div className="mt-1 space-y-0.5 font-mono text-xs">
              {demoHints.slice(0, 2).map((h) => <div key={h}>{h}</div>)}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleLogin}
        disabled={!selectedRole || !id || !password || loading}
        className="w-full max-w-sm py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
        {loading ? 'Verifying…' : 'Login →'}
      </button>

      <p className="mt-6 text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
        All data is simulated · Not connected to real VIT systems
      </p>
    </div>
  );
}
