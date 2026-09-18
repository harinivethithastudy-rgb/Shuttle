import { useState, useEffect } from 'react';
import { STUDENT_ACCOUNTS } from '../store/appStore';
import type { AppStore, LivePassenger } from '../store/appStore';
import type { TransactionStatus } from '../data/mockData';
import { FARE } from '../data/mockData';

interface Props {
  store: AppStore;
}

const statusInfo: Record<TransactionStatus, { label: string; color: string; bg: string }> = {
  AUTHORIZED: { label: 'Authorized', color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
  COMPLETED: { label: 'Fare Paid', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  OUTSTANDING: { label: 'Outstanding ₹20', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  PENDING_SYNC: { label: 'Pending Sync', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  FAILED: { label: 'Failed', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  CANCELLED: { label: 'Cancelled', color: '#64748B', bg: 'rgba(100,116,139,0.12)' },
  SYNCHRONIZED: { label: 'Synced ✓', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
};

type ScanState = 'idle' | 'scanning' | 'success' | 'error' | 'duplicate' | 'insufficient';

export default function DriverDashboard({ store }: Props) {
  if (store.session?.role !== 'driver') return null;
  const driverAccount = store.session.account;
  const shuttleId = driverAccount.assignedShuttleId;
  const shuttle = store.shuttles[shuttleId];

  const [isOnline, setIsOnline] = useState(true);
  const [selectedDemoStudent, setSelectedDemoStudent] = useState('');
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanResult, setScanResult] = useState<{ passenger?: LivePassenger; studentName?: string; error?: string } | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && shuttle?.passengers.some((p) => p.status === 'PENDING_SYNC')) {
      setSyncing(true);
      const timer = setTimeout(() => {
        store.syncOfflinePassengers(shuttleId);
        setSyncing(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  function handleToggleOnline() {
    const next = !isOnline;
    setIsOnline(next);
    store.setShuttleOnline(shuttleId, next);
  }

  function handleStartTrip() {
    store.startTrip(shuttleId);
  }

  function handleEndTrip() {
    store.endTrip(shuttleId);
  }

  function handleScan() {
    if (!selectedDemoStudent) return;
    setScanState('scanning');
    setScanResult(null);

    setTimeout(() => {
      const acc = STUDENT_ACCOUNTS.find((a) => a.studentId === selectedDemoStudent);
      if (!acc) {
        setScanState('error');
        setScanResult({ error: 'Unknown student ID — QR rejected' });
        return;
      }

      if (shuttle?.passengers.find((p) => p.studentId === acc.studentId)) {
        setScanState('duplicate');
        setScanResult({ studentName: acc.name, error: 'Already boarded on this shuttle' });
        return;
      }

      const result = store.boardPassenger(shuttleId, acc.studentId, !isOnline);

      if (!result.success) {
        setScanState('error');
        setScanResult({ error: result.error });
        return;
      }

      if (result.status === 'OUTSTANDING') {
        setScanState('insufficient');
      } else {
        setScanState('success');
      }
      setScanResult({ studentName: acc.name });
      setSelectedDemoStudent('');
    }, 800);

    setTimeout(() => setScanState('idle'), 4000);
  }

  if (!shuttle) return (
    <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--muted-foreground)' }}>
      Shuttle not found
    </div>
  );

  const passengers = shuttle.passengers;
  const pendingSyncCount = passengers.filter((p) => p.status === 'PENDING_SYNC').length;
  const tripActive = shuttle.status === 'ACTIVE' || shuttle.status === 'FULL';

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b"
        style={{ background: 'rgba(7,11,20,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ color: 'var(--primary)' }}>🚍</span>
          <div>
            <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{shuttle.number}</span>
            <span className="text-xs ml-2 hidden sm:inline" style={{ color: 'var(--muted-foreground)' }}>
              {driverAccount.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleToggleOnline}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all"
            style={{
              background: isOnline ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              color: isOnline ? '#10B981' : '#EF4444',
              border: `1px solid ${isOnline ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: isOnline ? '#10B981' : '#EF4444' }} />
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </button>
          <button onClick={store.logout} className="text-xs px-3 py-1.5 rounded-lg border"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Route + trip control */}
        <div className="rounded-xl p-4 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗺️</span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{shuttle.route}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {passengers.length} / {shuttle.capacity} passengers · {shuttle.status}
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            {!tripActive ? (
              <button onClick={handleStartTrip}
                disabled={shuttle.status === 'OFFLINE'}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                ▶ Start Trip
              </button>
            ) : (
              <button onClick={handleEndTrip}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                ◼ End Trip & Settle Fares
              </button>
            )}
          </div>
        </div>

        {/* Offline banner */}
        {!isOnline && (
          <div className="rounded-xl px-4 py-3 flex items-start gap-3 text-sm"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B' }}>
            <span className="text-lg flex-shrink-0">📡</span>
            <div>
              <p className="font-semibold">Offline Mode Active</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(245,158,11,0.8)' }}>
                Transactions stored locally. Auto-syncs on reconnect.
              </p>
            </div>
          </div>
        )}

        {/* Sync indicator */}
        {syncing && (
          <div className="rounded-xl px-4 py-3 flex items-center gap-3 text-sm"
            style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4' }}>
            <span className="animate-spin inline-block text-base">⟳</span>
            <p className="text-xs">Syncing {pendingSyncCount} offline transaction{pendingSyncCount > 1 ? 's' : ''}…</p>
          </div>
        )}

        {/* Scanner — only when trip is active */}
        {tripActive && (
          <div className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-xs uppercase tracking-widest mb-4"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
              Scan VIT ID to Board Shuttle
            </p>
            <div className="flex gap-3">
              <select value={selectedDemoStudent} onChange={(e) => { setSelectedDemoStudent(e.target.value); setScanState('idle'); }}
                className="flex-1 px-3 py-3 rounded-xl text-sm border appearance-none"
                style={{ background: 'var(--secondary)', borderColor: 'var(--border)',
                  color: selectedDemoStudent ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                <option value="">Select demo student…</option>
                {STUDENT_ACCOUNTS.map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.name} · {s.studentId}
                  </option>
                ))}
              </select>
              <button onClick={handleScan} disabled={!selectedDemoStudent || scanState === 'scanning'}
                className="px-5 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                {scanState === 'scanning' ? '…' : '⊙ Scan'}
              </button>
            </div>

            {/* Scan result */}
            {scanResult && scanState !== 'idle' && scanState !== 'scanning' && (
              <div className="mt-4 rounded-xl p-4 border"
                style={{
                  background: scanState === 'success' ? 'rgba(16,185,129,0.08)'
                    : scanState === 'insufficient' ? 'rgba(245,158,11,0.08)'
                      : 'rgba(239,68,68,0.08)',
                  borderColor: scanState === 'success' ? 'rgba(16,185,129,0.25)'
                    : scanState === 'insufficient' ? 'rgba(245,158,11,0.25)'
                      : 'rgba(239,68,68,0.25)',
                }}>
                {scanState === 'success' && (
                  <>
                    <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: '#10B981' }}>
                      ✓ Trip Authorized
                    </div>
                    <div className="mt-2 text-xs space-y-1">
                      <p><span style={{ color: 'var(--muted-foreground)' }}>Student:</span> {scanResult.studentName}</p>
                      <p><span style={{ color: 'var(--muted-foreground)' }}>Fare:</span> ₹{FARE}</p>
                      <p><span style={{ color: 'var(--muted-foreground)' }}>Shuttle:</span> {shuttle.number}</p>
                      {!isOnline && <p style={{ color: '#F59E0B' }}>⚡ Stored offline — will sync on reconnect</p>}
                    </div>
                  </>
                )}
                {scanState === 'insufficient' && (
                  <>
                    <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: '#F59E0B' }}>
                      ⚠️ Insufficient Balance — OUTSTANDING
                    </div>
                    <div className="mt-2 text-xs space-y-1">
                      <p><span style={{ color: 'var(--muted-foreground)' }}>Student:</span> {scanResult.studentName}</p>
                      <p style={{ color: '#EF4444' }}>₹20 recorded as outstanding due. Trip allowed.</p>
                    </div>
                  </>
                )}
                {(scanState === 'error' || scanState === 'duplicate') && (
                  <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: '#EF4444' }}>
                    ✕ {scanResult.error}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Passenger list */}
        <div>
          <p className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
            Passengers ({passengers.length})
          </p>
          {passengers.length === 0 ? (
            <div className="text-center py-10 rounded-xl border"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              <p className="text-3xl mb-2">👥</p>
              <p className="text-sm">
                {tripActive ? 'No passengers yet — scan a VIT ID to board' : 'Start the trip to begin boarding'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {passengers.map((p) => {
                const st = statusInfo[p.status];
                return (
                  <div key={p.transactionId} className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                      {p.avatarInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
                        {p.studentId} · {p.program}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 space-y-1">
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{p.boardedAt}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full block"
                        style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Boarded', value: passengers.length },
            { label: 'Fares', value: `₹${passengers.filter((p) => ['AUTHORIZED','COMPLETED','SYNCHRONIZED'].includes(p.status)).length * FARE}` },
            { label: 'Outstanding', value: `₹${passengers.filter((p) => p.status === 'OUTSTANDING').length * FARE}` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl p-3 border text-center"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)' }}>{stat.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
