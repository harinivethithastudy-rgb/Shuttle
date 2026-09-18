import { useState } from 'react';
import type { AppStore, LiveTransaction } from '../store/appStore';
import { STUDENT_ACCOUNTS } from '../store/appStore';
import { FARE } from '../data/mockData';
import type { TransactionStatus } from '../data/mockData';

interface Props {
  store: AppStore;
}

type Tab = 'overview' | 'transactions' | 'students' | 'fleet';

const statusColors: Record<TransactionStatus, { bg: string; text: string; label: string }> = {
  COMPLETED: { bg: 'rgba(16,185,129,0.15)', text: '#10B981', label: 'Completed' },
  AUTHORIZED: { bg: 'rgba(6,182,212,0.15)', text: '#06B6D4', label: 'Authorized' },
  OUTSTANDING: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', label: 'Outstanding' },
  PENDING_SYNC: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', label: 'Pending Sync' },
  FAILED: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', label: 'Failed' },
  CANCELLED: { bg: 'rgba(100,116,139,0.15)', text: '#64748B', label: 'Cancelled' },
  SYNCHRONIZED: { bg: 'rgba(16,185,129,0.15)', text: '#10B981', label: 'Synced' },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function AdminDashboard({ store }: Props) {
  const [tab, setTab] = useState<Tab>('overview');

  if (store.session?.role !== 'admin') return null;

  const shuttleList = Object.values(store.shuttles);
  const txns = store.transactions;

  const completedTxns = txns.filter((t) => t.status === 'COMPLETED' && !t.isCredit);
  const outstandingTxns = txns.filter((t) => t.status === 'OUTSTANDING');
  const totalRevenue = completedTxns.length * FARE;
  const totalOutstanding = outstandingTxns.length * FARE;
  const activeShuttles = shuttleList.filter((s) => s.status === 'ACTIVE' || s.status === 'FULL').length;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'students', label: 'Students' },
    { id: 'fleet', label: 'Fleet' },
  ];

  const statusStyle: Record<string, { bg: string; text: string }> = {
    AVAILABLE: { bg: 'rgba(16,185,129,0.12)', text: '#10B981' },
    ACTIVE: { bg: 'rgba(6,182,212,0.12)', text: '#06B6D4' },
    FULL: { bg: 'rgba(239,68,68,0.12)', text: '#EF4444' },
    OFFLINE: { bg: 'rgba(100,116,139,0.12)', text: '#64748B' },
  };

  function getShuttleName(shuttleId: string) {
    return store.shuttles[shuttleId]?.number ?? shuttleId;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b"
        style={{ background: 'rgba(7,11,20,0.92)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ color: 'var(--primary)' }}>🚍</span>
          <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>SmartShuttle Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: 'rgba(6,182,212,0.08)', color: '#06B6D4' }}>
            ⚙️ {store.session.account.name}
          </div>
          <button onClick={store.logout} className="text-xs px-3 py-1.5 rounded-lg border"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b px-5 gap-1 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap"
            style={{
              borderColor: tab === t.id ? 'var(--primary)' : 'transparent',
              color: tab === t.id ? 'var(--primary)' : 'var(--muted-foreground)',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total Revenue', value: `₹${totalRevenue}`, icon: '💰', color: '#10B981' },
                { label: 'Outstanding', value: `₹${totalOutstanding}`, icon: '⚠️', color: '#EF4444' },
                { label: 'Active Shuttles', value: activeShuttles, icon: '🚌', color: '#06B6D4' },
                { label: 'Students', value: STUDENT_ACCOUNTS.length, icon: '🎓', color: '#A78BFA' },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-xl p-4 border"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <span className="text-xl">{kpi.icon}</span>
                  <p className="text-2xl font-bold mt-2" style={{ fontFamily: 'var(--font-display)', color: kpi.color }}>
                    {kpi.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{kpi.label}</p>
                </div>
              ))}
            </div>

            {/* Shuttle live status */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-3"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                Live Shuttle Status
              </p>
              <div className="space-y-2">
                {shuttleList.map((s) => {
                  const ss = statusStyle[s.status];
                  return (
                    <div key={s.shuttleId} className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                      <span className="text-xl">🚌</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{s.number}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                            style={{ background: ss.bg, color: ss.text }}>{s.status}</span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                          {s.passengers.length}/{s.capacity} · {s.driverName}
                        </p>
                      </div>
                      {/* Admin override */}
                      <select
                        value={s.status}
                        onChange={(e) => store.setShuttleStatus(s.shuttleId, e.target.value as any)}
                        className="text-xs px-2 py-1.5 rounded-lg border appearance-none"
                        style={{ background: 'var(--secondary)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                        <option value="AVAILABLE">AVAILABLE</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="FULL">FULL</option>
                        <option value="OFFLINE">OFFLINE</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transaction breakdown */}
            <div className="rounded-xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-xs uppercase tracking-widest mb-4"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                Transaction Breakdown
              </p>
              {(['COMPLETED', 'OUTSTANDING', 'AUTHORIZED', 'PENDING_SYNC'] as TransactionStatus[]).map((status) => {
                const count = txns.filter((t) => t.status === status && !t.isCredit).length;
                const pct = txns.length > 0 ? (count / txns.length) * 100 : 0;
                const s = statusColors[status];
                return (
                  <div key={status} className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span style={{ color: s.text }}>{s.label}</span>
                      <span style={{ color: 'var(--muted-foreground)' }}>{count} · ₹{count * FARE}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--secondary)' }}>
                      <div className="h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%`, background: s.text }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Transactions ── */}
        {tab === 'transactions' && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest mb-4"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
              All Transactions ({txns.length})
            </p>
            {txns.map((txn) => {
              const acc = STUDENT_ACCOUNTS.find((a) => a.studentId === txn.studentId);
              const s = statusColors[txn.status];
              return (
                <div key={txn.transactionId} className="rounded-xl border p-4"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                      {acc?.avatarInitials ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{acc?.name ?? txn.studentId}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: s.bg, color: s.text }}>{s.label}</span>
                        {txn.isCredit && (
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(16,185,129,0.12)', color: '#10B981' }}>Top-up</span>
                        )}
                      </div>
                      <p className="text-xs mt-1 font-mono" style={{ color: 'var(--muted-foreground)' }}>
                        {txn.transactionId}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {txn.label ?? getShuttleName(txn.shuttleId)} · {formatTime(txn.timestamp)}
                      </p>
                    </div>
                    <p className="font-bold text-lg flex-shrink-0"
                      style={{ fontFamily: 'var(--font-display)', color: txn.isCredit ? '#10B981' : undefined }}>
                      {txn.isCredit ? '+' : '-'}₹{txn.amount}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Students ── */}
        {tab === 'students' && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest mb-4"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
              Student Accounts ({STUDENT_ACCOUNTS.length})
            </p>
            {STUDENT_ACCOUNTS.map((acc) => {
              const wallet = store.wallets[acc.studentId];
              const txnCount = txns.filter((t) => t.studentId === acc.studentId && t.status === 'COMPLETED' && !t.isCredit).length;
              return (
                <div key={acc.studentId} className="rounded-xl border p-4"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                      style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-display)' }}>
                      {acc.avatarInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{acc.name}</p>
                      <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--muted-foreground)' }}>
                        {acc.studentId} · {acc.program}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>
                        ₹{wallet?.balance ?? 0}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {txnCount} trips
                      </p>
                    </div>
                  </div>
                  {(wallet?.outstandingDues ?? 0) > 0 && (
                    <div className="mt-2 text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                      ⚠️ Outstanding dues: ₹{wallet?.outstandingDues}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Fleet ── */}
        {tab === 'fleet' && (
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest mb-4"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
              Fleet ({shuttleList.length} shuttles)
            </p>
            {shuttleList.map((s) => {
              const ss = statusStyle[s.status];
              const revenue = txns.filter((t) => t.shuttleId === s.shuttleId && t.status === 'COMPLETED' && !t.isCredit).length * FARE;
              return (
                <div key={s.shuttleId} className="rounded-xl border p-5"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚌</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{s.number}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: ss.bg, color: ss.text }}>{s.status}</span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{s.route}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        <span>Driver: {s.driverName}</span>
                        <span>Capacity: {s.capacity}</span>
                        <span>Passengers: {s.passengers.length}</span>
                        <span style={{ color: '#10B981' }}>Revenue: ₹{revenue}</span>
                      </div>
                    </div>
                    <select
                      value={s.status}
                      onChange={(e) => store.setShuttleStatus(s.shuttleId, e.target.value as any)}
                      className="text-xs px-2 py-1.5 rounded-lg border appearance-none flex-shrink-0"
                      style={{ background: 'var(--secondary)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="FULL">FULL</option>
                      <option value="OFFLINE">OFFLINE</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
