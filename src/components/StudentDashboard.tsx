import { useState } from 'react';
import type { AppStore, LiveTransaction } from '../store/appStore';
import { FARE } from '../data/mockData';
import QRCode from './QRCode';

interface Props {
  store: AppStore;
}

type TransactionStatus = LiveTransaction['status'];

const statusColors: Record<TransactionStatus, { bg: string; text: string; label: string }> = {
  COMPLETED: { bg: 'rgba(16,185,129,0.15)', text: '#10B981', label: 'Paid' },
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

type Tab = 'overview' | 'id' | 'history' | 'shuttles';

// ── Wallet top-up modal ───────────────────────────────────────────────────────

function TopUpModal({ currentBalance, onConfirm, onClose }: {
  currentBalance: number;
  onConfirm: (amount: number) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<'select' | 'confirm' | 'done'>('select');
  const [amount, setAmount] = useState<number | null>(null);
  const [custom, setCustom] = useState('');
  const presets = [50, 100, 200, 500];

  const chosen = amount ?? (custom ? Number(custom) : null);

  function handleConfirm() {
    if (!chosen || chosen <= 0) return;
    setStep('confirm');
  }

  function handlePay() {
    if (!chosen) return;
    onConfirm(chosen);
    setStep('done');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-sm rounded-2xl border p-6"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>

        {step === 'select' && (
          <>
            <h2 className="font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-display)' }}>Add Money</h2>
            <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>
              Current balance: <strong style={{ color: 'var(--foreground)' }}>₹{currentBalance}</strong>
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {presets.map((p) => (
                <button key={p} onClick={() => { setAmount(p); setCustom(''); }}
                  className="py-3 rounded-xl text-sm font-semibold border transition-all"
                  style={{
                    background: amount === p ? 'rgba(6,182,212,0.1)' : 'var(--secondary)',
                    borderColor: amount === p ? 'var(--primary)' : 'var(--border)',
                    color: amount === p ? 'var(--primary)' : 'var(--foreground)',
                  }}>
                  ₹{p}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={custom}
              onChange={(e) => { setCustom(e.target.value); setAmount(null); }}
              placeholder="Custom amount (₹)"
              className="w-full px-3 py-2.5 rounded-xl text-sm border mb-5"
              style={{ background: 'var(--secondary)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                Cancel
              </button>
              <button onClick={handleConfirm} disabled={!chosen || chosen <= 0}
                className="flex-1 py-3 rounded-xl text-sm font-semibold disabled:opacity-40"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                Continue
              </button>
            </div>
          </>
        )}

        {step === 'confirm' && chosen && (
          <>
            <h2 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-display)' }}>Confirm Payment</h2>
            <div className="py-4 text-center my-3 rounded-xl" style={{ background: 'var(--secondary)' }}>
              <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#10B981' }}>₹{chosen}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Add to SmartShuttle Wallet</p>
            </div>
            <p className="text-xs text-center mb-5" style={{ color: 'var(--muted-foreground)' }}>
              Demo payment — no real money is processed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setStep('select')} className="flex-1 py-3 rounded-xl text-sm border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                Cancel
              </button>
              <button onClick={handlePay} className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                Pay ₹{chosen}
              </button>
            </div>
          </>
        )}

        {step === 'done' && chosen && (
          <>
            <div className="text-center py-4">
              <div className="text-4xl mb-3">✅</div>
              <h2 className="font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-display)' }}>Payment Successful</h2>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Demo payment — no real money processed</p>
              <div className="text-left rounded-xl p-4 space-y-2 text-sm"
                style={{ background: 'var(--secondary)' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--muted-foreground)' }}>Previous Balance</span>
                  <span>₹{currentBalance}</span>
                </div>
                <div className="flex justify-between" style={{ color: '#10B981' }}>
                  <span>Added</span>
                  <span>+₹{chosen}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2" style={{ borderColor: 'var(--border)' }}>
                  <span>New Balance</span>
                  <span>₹{currentBalance + chosen}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-full mt-5 py-3 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StudentDashboard({ store }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const [showTopUp, setShowTopUp] = useState(false);

  if (store.session?.role !== 'student') return null;
  const student = store.session.account;
  const wallet = store.wallets[student.studentId];
  const shuttles = Object.values(store.shuttles);

  const myTransactions = store.transactions
    .filter((t) => t.studentId === student.studentId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Find active trip (student is in a shuttle that's currently ACTIVE)
  const activePassenger = shuttles
    .filter((s) => s.status === 'ACTIVE' || s.status === 'FULL')
    .flatMap((s) => s.passengers.map((p) => ({ ...p, shuttle: s })))
    .find((p) => p.studentId === student.studentId);

  function getDemandLabel(pax: number, cap: number): { label: string; color: string } {
    const ratio = pax / cap;
    if (ratio === 0) return { label: 'No Demand', color: '#64748B' };
    if (ratio < 0.3) return { label: 'Low Demand', color: '#10B981' };
    if (ratio < 0.7) return { label: 'Moderate Demand', color: '#F59E0B' };
    return { label: 'High Demand', color: '#EF4444' };
  }

  const statusStyle: Record<string, { bg: string; text: string }> = {
    AVAILABLE: { bg: 'rgba(16,185,129,0.12)', text: '#10B981' },
    ACTIVE: { bg: 'rgba(6,182,212,0.12)', text: '#06B6D4' },
    FULL: { bg: 'rgba(239,68,68,0.12)', text: '#EF4444' },
    OFFLINE: { bg: 'rgba(100,116,139,0.12)', text: '#64748B' },
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'shuttles', label: 'Shuttles' },
    { id: 'id', label: 'My VIT ID' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {showTopUp && wallet && (
        <TopUpModal
          currentBalance={wallet.balance}
          onConfirm={(amount) => store.topUpWallet(student.studentId, amount)}
          onClose={() => setShowTopUp(false)}
        />
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b"
        style={{ background: 'rgba(7,11,20,0.9)', backdropFilter: 'blur(12px)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg" style={{ color: 'var(--primary)' }}>🚍</span>
          <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>SmartShuttle</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              {student.avatarInitials}
            </div>
            <span className="text-sm hidden sm:block">{student.name.split(' ')[0]}</span>
          </div>
          <button onClick={store.logout} className="text-xs px-3 py-1.5 rounded-lg border"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            Logout
          </button>
        </div>
      </header>

      {/* Tab bar */}
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

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <>
            {/* Wallet card */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0F2A4A 100%)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <div className="px-6 pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-1"
                      style={{ color: 'rgba(6,182,212,0.7)', fontFamily: 'var(--font-mono)' }}>
                      VIT Wallet · {wallet?.walletId}
                    </p>
                    <p className="text-4xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#fff' }}>
                      ₹{wallet?.balance ?? 0}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTopUp(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                    + Add Money
                  </button>
                </div>
                {(wallet?.outstandingDues ?? 0) > 0 && (
                  <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                    style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>
                    ⚠️ Outstanding dues: <strong>₹{wallet?.outstandingDues}</strong> — please top up
                  </div>
                )}
              </div>
              <div className="px-6 pb-4 flex gap-4 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                <span>Fare per ride: ₹{FARE}</span>
                <span>·</span>
                <span>Trips: {myTransactions.filter((t) => t.status === 'COMPLETED').length}</span>
              </div>
            </div>

            {/* Active trip */}
            <div className="rounded-xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <p className="text-xs uppercase tracking-widest mb-3"
                style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                Current Trip
              </p>
              {activePassenger ? (
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: 'rgba(6,182,212,0.1)' }}>🚌</div>
                    <div>
                      <p className="font-semibold text-sm">{activePassenger.shuttle.number}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {activePassenger.shuttle.route}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: 'rgba(6,182,212,0.15)', color: '#06B6D4' }}>
                        In Progress
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    <span>Fare: ₹{FARE}</span>
                    <span>·</span>
                    <span>Status: {activePassenger.status}</span>
                    <span>·</span>
                    <span>Boarded: {activePassenger.boardedAt}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3" style={{ color: 'var(--muted-foreground)' }}>
                  <span className="text-2xl">🚏</span>
                  <p className="text-sm">No active trip — board a shuttle to begin</p>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Completed Trips</p>
                <p className="text-2xl font-bold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {myTransactions.filter((t) => t.status === 'COMPLETED' && !t.isCredit).length}
                </p>
              </div>
              <div className="rounded-xl p-4 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Total Spent</p>
                <p className="text-2xl font-bold mt-1" style={{ fontFamily: 'var(--font-display)' }}>
                  ₹{myTransactions.filter((t) => t.status === 'COMPLETED' && !t.isCredit).length * FARE}
                </p>
              </div>
            </div>

            {/* Recent activity */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest"
                  style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                  Recent Activity
                </p>
                <button onClick={() => setTab('history')} className="text-xs" style={{ color: 'var(--primary)' }}>
                  View all →
                </button>
              </div>
              {myTransactions.slice(0, 3).map((txn) => {
                const s = statusColors[txn.status];
                return (
                  <div key={txn.transactionId} className="flex items-center gap-3 px-4 py-3 rounded-xl border mb-2"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                      style={{ background: 'var(--secondary)' }}>
                      {txn.isCredit ? '💰' : '🚌'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {txn.label ?? (store.shuttles[txn.shuttleId]?.number ?? txn.shuttleId)}
                      </p>
                      <p className="text-xs mt-0.5 font-mono truncate" style={{ color: 'var(--muted-foreground)' }}>
                        {formatTime(txn.timestamp)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold" style={{ color: txn.isCredit ? '#10B981' : undefined }}>
                        {txn.isCredit ? '+' : '-'}₹{txn.amount}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: s.bg, color: s.text }}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Shuttle Availability ── */}
        {tab === 'shuttles' && (
          <div>
            <p className="text-xs uppercase tracking-widest mb-4"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
              Shuttle Availability
            </p>
            <div className="space-y-3">
              {shuttles.map((s) => {
                const ss = statusStyle[s.status];
                const demand = getDemandLabel(s.passengers.length, s.capacity);
                const pct = s.capacity > 0 ? (s.passengers.length / s.capacity) * 100 : 0;
                return (
                  <div key={s.shuttleId} className="rounded-xl border p-4"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🚌</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{s.number}</span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                              style={{ background: ss.bg, color: ss.text }}>
                              {s.status}
                            </span>
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                            {s.route}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                            Driver: {s.driverName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold font-mono">
                          {s.status === 'OFFLINE' ? '—' : `${s.passengers.length} / ${s.capacity}`}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: demand.color }}>{demand.label}</p>
                      </div>
                    </div>
                    {s.status !== 'OFFLINE' && (
                      <div className="mt-3">
                        <div className="h-1.5 rounded-full" style={{ background: 'var(--secondary)' }}>
                          <div className="h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%`, background: ss.text }} />
                        </div>
                        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                          {s.capacity - s.passengers.length} seats available
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-center mt-4" style={{ color: 'var(--muted-foreground)' }}>
              Live data · Updates when driver boards passengers
            </p>
          </div>
        )}

        {/* ── My VIT ID ── */}
        {tab === 'id' && (
          <div className="flex flex-col items-center py-4">
            <div className="w-full max-w-xs rounded-2xl overflow-hidden border"
              style={{ background: 'linear-gradient(145deg, #0A1628, #0F2040)', borderColor: 'rgba(6,182,212,0.3)' }}>
              <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b"
                style={{ borderColor: 'rgba(6,182,212,0.15)' }}>
                <div>
                  <p className="text-xs font-bold tracking-widest"
                    style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>VIT UNIVERSITY</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Student Identity · SmartShuttle</p>
                </div>
                <span className="text-2xl">🎓</span>
              </div>
              <div className="px-5 py-5 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mb-3"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-display)' }}>
                  {student.avatarInitials}
                </div>
                <p className="font-bold text-base text-center" style={{ fontFamily: 'var(--font-display)' }}>{student.name}</p>
                <p className="text-xs mt-1 text-center" style={{ color: 'var(--muted-foreground)' }}>
                  {student.program} · Year {student.year}
                </p>
                <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--primary)' }}>{student.studentId}</p>
                <div className="mt-5 p-3 rounded-xl" style={{ background: '#fff' }}>
                  <QRCode payload={student.qrPayload} size={140} />
                </div>
                <p className="text-xs mt-3 text-center px-4" style={{ color: 'var(--muted-foreground)' }}>
                  Present this QR to the driver scanner when boarding
                </p>
              </div>
              <div className="px-5 pb-4">
                <div className="px-3 py-2 rounded-lg font-mono break-all"
                  style={{ background: 'rgba(6,182,212,0.06)', color: 'var(--muted-foreground)', fontSize: '9px' }}>
                  {student.qrPayload}
                </div>
              </div>
            </div>
            <div className="mt-5 px-4 py-3 rounded-xl text-xs text-center"
              style={{ background: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
              ⚠️ QR payload contains only your student ID — no financial data
            </div>
          </div>
        )}

        {/* ── History ── */}
        {tab === 'history' && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest mb-4"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
              All Transactions ({myTransactions.length})
            </p>
            {myTransactions.length === 0 && (
              <div className="text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
                <p className="text-3xl mb-2">🚏</p>
                <p className="text-sm">No transactions yet</p>
              </div>
            )}
            {myTransactions.map((txn) => {
              const s = statusColors[txn.status];
              const shuttleName = txn.shuttleId ? (store.shuttles[txn.shuttleId]?.number ?? txn.shuttleId) : '';
              return (
                <div key={txn.transactionId} className="rounded-xl border p-4"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{txn.isCredit ? '💰' : '🚌'}</span>
                        <span className="font-semibold text-sm">{txn.label ?? shuttleName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: s.bg, color: s.text }}>{s.label}</span>
                      </div>
                      <p className="text-xs mt-1.5 font-mono" style={{ color: 'var(--muted-foreground)' }}>
                        {txn.transactionId}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        {formatTime(txn.timestamp)}
                      </p>
                    </div>
                    <p className="font-bold text-lg flex-shrink-0"
                      style={{ fontFamily: 'var(--font-display)', color: txn.isCredit ? '#10B981' : undefined }}>
                      {txn.isCredit ? '+' : '-'}₹{txn.amount}
                    </p>
                  </div>
                  {shuttleName && !txn.isCredit && (
                    <p className="text-xs mt-1 pl-5" style={{ color: 'var(--muted-foreground)' }}>
                      {store.shuttles[txn.shuttleId]?.route}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
