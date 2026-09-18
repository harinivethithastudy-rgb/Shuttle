import { useState, useCallback } from 'react';
import {
  FARE,
  type TransactionStatus,
} from '../data/mockData';

// ─── Auth accounts ────────────────────────────────────────────────────────────

export interface StudentAccount {
  studentId: string;
  name: string;
  program: string;
  year: number;
  email: string;
  walletId: string;
  qrPayload: string;
  avatarInitials: string;
  password: string;
}

export interface DriverAccount {
  driverId: string;
  name: string;
  password: string;
  assignedShuttleId: string;
}

export interface AdminAccount {
  adminId: string;
  name: string;
  password: string;
}

export const STUDENT_ACCOUNTS: StudentAccount[] = [
  {
    studentId: 'VIT2021001',
    name: 'Arjun Sharma',
    program: 'B.Tech CSE',
    year: 3,
    email: 'arjun.sharma@vitstudent.ac.in',
    walletId: 'WLT-001',
    qrPayload: 'VIT-STUDENT::VIT2021001::ARJUN_SHARMA::HMAC-a7f3c',
    avatarInitials: 'AS',
    password: 'student123',
  },
  {
    studentId: 'VIT2021056',
    name: 'Kiran Patel',
    program: 'B.Tech IT',
    year: 2,
    email: 'kiran.patel@vitstudent.ac.in',
    walletId: 'WLT-002',
    qrPayload: 'VIT-STUDENT::VIT2021056::KIRAN_PATEL::HMAC-b9e1d',
    avatarInitials: 'KP',
    password: 'student123',
  },
  {
    studentId: 'VIT2021088',
    name: 'Priya Nair',
    program: 'B.Tech ECE',
    year: 2,
    email: 'priya.nair@vitstudent.ac.in',
    walletId: 'WLT-003',
    qrPayload: 'VIT-STUDENT::VIT2021088::PRIYA_NAIR::HMAC-c2a9f',
    avatarInitials: 'PN',
    password: 'student123',
  },
];

export const DRIVER_ACCOUNTS: DriverAccount[] = [
  { driverId: 'DRV001', name: 'Murugan R.', password: 'driver123', assignedShuttleId: 'SHT-01' },
  { driverId: 'DRV002', name: 'Selvam K.', password: 'driver123', assignedShuttleId: 'SHT-02' },
  { driverId: 'DRV003', name: 'Rajan P.', password: 'driver123', assignedShuttleId: 'SHT-03' },
];

export const ADMIN_ACCOUNTS: AdminAccount[] = [
  { adminId: 'ADM001', name: 'Campus Admin', password: 'admin123' },
];

// ─── Live data types ──────────────────────────────────────────────────────────

export interface LiveWallet {
  walletId: string;
  studentId: string;
  balance: number;
  outstandingDues: number;
}

export interface LiveTransaction {
  transactionId: string;
  studentId: string;
  shuttleId: string;
  amount: number;
  timestamp: string;
  status: TransactionStatus;
  tripId: string;
  label?: string;
  isCredit?: boolean;
}

export interface LivePassenger {
  studentId: string;
  name: string;
  avatarInitials: string;
  program: string;
  transactionId: string;
  status: TransactionStatus;
  boardedAt: string;
}

export interface LiveShuttle {
  shuttleId: string;
  number: string;
  route: string;
  capacity: number;
  driverName: string;
  status: 'AVAILABLE' | 'ACTIVE' | 'FULL' | 'OFFLINE';
  passengers: LivePassenger[];
  currentTripId: string | null;
  tripStartTime: string | null;
  isOnline: boolean;
}

export type AuthSession =
  | { role: 'student'; account: StudentAccount }
  | { role: 'driver'; account: DriverAccount }
  | { role: 'admin'; account: AdminAccount }
  | null;

// ─── Initial state ────────────────────────────────────────────────────────────

function initialWallets(): Record<string, LiveWallet> {
  return {
    'VIT2021001': { walletId: 'WLT-001', studentId: 'VIT2021001', balance: 180, outstandingDues: 0 },
    'VIT2021056': { walletId: 'WLT-002', studentId: 'VIT2021056', balance: 20, outstandingDues: 0 },
    'VIT2021088': { walletId: 'WLT-003', studentId: 'VIT2021088', balance: 5, outstandingDues: 0 },
  };
}

function initialShuttles(): Record<string, LiveShuttle> {
  return {
    'SHT-01': {
      shuttleId: 'SHT-01', number: 'VIT-01',
      route: 'Main Gate → Tech Tower → Hostel Block A',
      capacity: 40, driverName: 'Murugan R.',
      status: 'AVAILABLE', passengers: [], currentTripId: null, tripStartTime: null, isOnline: true,
    },
    'SHT-02': {
      shuttleId: 'SHT-02', number: 'VIT-02',
      route: 'Hostel Block B → Library → Admin Block',
      capacity: 40, driverName: 'Selvam K.',
      status: 'AVAILABLE', passengers: [], currentTripId: null, tripStartTime: null, isOnline: true,
    },
    'SHT-03': {
      shuttleId: 'SHT-03', number: 'VIT-03',
      route: 'Sports Complex → GDN → Main Gate',
      capacity: 30, driverName: 'Rajan P.',
      status: 'OFFLINE', passengers: [], currentTripId: null, tripStartTime: null, isOnline: false,
    },
  };
}

// Pre-populate a few historical transactions
function seedTransactions(): LiveTransaction[] {
  const now = new Date();
  const yesterday = (h: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 1);
    d.setHours(h, 0, 0, 0);
    return d.toISOString();
  };
  return [
    {
      transactionId: 'TXN-SEED-001', studentId: 'VIT2021001', shuttleId: 'SHT-01',
      amount: 20, timestamp: yesterday(8), status: 'COMPLETED', tripId: 'TRIP-SEED-001',
    },
    {
      transactionId: 'TXN-SEED-002', studentId: 'VIT2021001', shuttleId: 'SHT-02',
      amount: 20, timestamp: yesterday(17), status: 'COMPLETED', tripId: 'TRIP-SEED-002',
    },
    {
      transactionId: 'TXN-SEED-003', studentId: 'VIT2021056', shuttleId: 'SHT-01',
      amount: 20, timestamp: yesterday(9), status: 'COMPLETED', tripId: 'TRIP-SEED-003',
    },
  ];
}

// ─── Store hook ───────────────────────────────────────────────────────────────

let _txnCounter = 200;
function newTxnId() { return `TXN-LIVE-${++_txnCounter}`; }
let _tripCounter = 100;
function newTripId() { return `TRIP-LIVE-${++_tripCounter}`; }

export function useAppStore() {
  const [session, setSession] = useState<AuthSession>(null);
  const [wallets, setWallets] = useState<Record<string, LiveWallet>>(initialWallets);
  const [shuttles, setShuttles] = useState<Record<string, LiveShuttle>>(initialShuttles);
  const [transactions, setTransactions] = useState<LiveTransaction[]>(seedTransactions);

  // ── Auth ──────────────────────────────────────────────────────────────────

  const login = useCallback((role: string, id: string, password: string): boolean => {
    if (role === 'student') {
      const acc = STUDENT_ACCOUNTS.find((a) => a.studentId === id && a.password === password);
      if (!acc) return false;
      setSession({ role: 'student', account: acc });
      return true;
    }
    if (role === 'driver') {
      const acc = DRIVER_ACCOUNTS.find((a) => a.driverId === id && a.password === password);
      if (!acc) return false;
      setSession({ role: 'driver', account: acc });
      return true;
    }
    if (role === 'admin') {
      const acc = ADMIN_ACCOUNTS.find((a) => a.adminId === id && a.password === password);
      if (!acc) return false;
      setSession({ role: 'admin', account: acc });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setSession(null), []);

  // ── Wallet ────────────────────────────────────────────────────────────────

  const topUpWallet = useCallback((studentId: string, amount: number) => {
    setWallets((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        balance: prev[studentId].balance + amount,
      },
    }));
    setTransactions((prev) => [
      {
        transactionId: newTxnId(),
        studentId,
        shuttleId: '',
        amount,
        timestamp: new Date().toISOString(),
        status: 'COMPLETED',
        tripId: '',
        label: 'Wallet Top-up',
        isCredit: true,
      },
      ...prev,
    ]);
  }, []);

  // ── Driver: toggle online/offline ──────────────────────────────────────────

  const setShuttleOnline = useCallback((shuttleId: string, online: boolean) => {
    setShuttles((prev) => ({
      ...prev,
      [shuttleId]: { ...prev[shuttleId], isOnline: online },
    }));
  }, []);

  // ── Driver: start trip ────────────────────────────────────────────────────

  const startTrip = useCallback((shuttleId: string) => {
    setShuttles((prev) => {
      const s = prev[shuttleId];
      if (s.status === 'OFFLINE') return prev;
      return {
        ...prev,
        [shuttleId]: {
          ...s,
          status: 'ACTIVE',
          currentTripId: newTripId(),
          tripStartTime: new Date().toISOString(),
          passengers: [],
        },
      };
    });
  }, []);

  // ── Driver: board passenger ───────────────────────────────────────────────

  const boardPassenger = useCallback((
    shuttleId: string,
    studentId: string,
    isOffline: boolean,
  ): { success: boolean; error?: string; status?: TransactionStatus } => {
    const shuttle = shuttles[shuttleId];
    if (!shuttle || shuttle.status === 'OFFLINE') return { success: false, error: 'Shuttle offline' };
    if (shuttle.passengers.find((p) => p.studentId === studentId)) {
      return { success: false, error: 'Already boarded on this shuttle' };
    }
    const acc = STUDENT_ACCOUNTS.find((a) => a.studentId === studentId);
    if (!acc) return { success: false, error: 'Unknown student ID — QR rejected' };

    const txnId = newTxnId();
    const tripId = shuttle.currentTripId ?? newTripId();
    const wallet = wallets[studentId];
    const hasBalance = wallet && wallet.balance >= FARE;
    const txnStatus: TransactionStatus = isOffline ? 'PENDING_SYNC' : (hasBalance ? 'AUTHORIZED' : 'OUTSTANDING');

    const passenger: LivePassenger = {
      studentId: acc.studentId,
      name: acc.name,
      avatarInitials: acc.avatarInitials,
      program: acc.program,
      transactionId: txnId,
      status: txnStatus,
      boardedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setShuttles((prev) => {
      const s = prev[shuttleId];
      const newPassengers = [...s.passengers, passenger];
      const isFull = newPassengers.length >= s.capacity;
      return {
        ...prev,
        [shuttleId]: {
          ...s,
          passengers: newPassengers,
          status: isFull ? 'FULL' : 'ACTIVE',
          currentTripId: tripId,
        },
      };
    });

    const liveTxn: LiveTransaction = {
      transactionId: txnId,
      studentId,
      shuttleId,
      amount: FARE,
      timestamp: new Date().toISOString(),
      status: txnStatus,
      tripId,
    };
    setTransactions((prev) => [liveTxn, ...prev]);

    return { success: true, status: txnStatus };
  }, [shuttles, wallets]);

  // ── Driver: end trip → settle fares ──────────────────────────────────────

  const endTrip = useCallback((shuttleId: string) => {
    setShuttles((prev) => {
      const s = prev[shuttleId];
      const settledPassengers = s.passengers.map((p) => ({
        ...p,
        status: p.status === 'OUTSTANDING' ? ('OUTSTANDING' as TransactionStatus) : ('COMPLETED' as TransactionStatus),
      }));
      return {
        ...prev,
        [shuttleId]: {
          ...s,
          status: 'AVAILABLE',
          passengers: settledPassengers,
          currentTripId: null,
          tripStartTime: null,
        },
      };
    });

    // Settle wallets and mark transactions
    const shuttle = shuttles[shuttleId];
    if (!shuttle) return;

    shuttle.passengers.forEach((p) => {
      const wallet = wallets[p.studentId];
      if (!wallet) return;
      const isFinalStatus = p.status === 'OUTSTANDING';
      if (isFinalStatus) {
        // Record outstanding due
        setWallets((prev) => ({
          ...prev,
          [p.studentId]: {
            ...prev[p.studentId],
            outstandingDues: prev[p.studentId].outstandingDues + FARE,
          },
        }));
      } else {
        // Deduct fare
        setWallets((prev) => ({
          ...prev,
          [p.studentId]: {
            ...prev[p.studentId],
            balance: Math.max(0, prev[p.studentId].balance - FARE),
          },
        }));
      }
    });

    // Update transaction statuses
    setTransactions((prev) =>
      prev.map((t) => {
        const pax = shuttle.passengers.find((p) => p.transactionId === t.transactionId);
        if (!pax) return t;
        const wallet = wallets[t.studentId];
        if (pax.status === 'OUTSTANDING' || (wallet && wallet.balance < FARE)) {
          return { ...t, status: 'OUTSTANDING' };
        }
        return { ...t, status: 'COMPLETED' };
      })
    );
  }, [shuttles, wallets]);

  // ── Driver: sync offline txns ─────────────────────────────────────────────

  const syncOfflinePassengers = useCallback((shuttleId: string) => {
    setShuttles((prev) => ({
      ...prev,
      [shuttleId]: {
        ...prev[shuttleId],
        passengers: prev[shuttleId].passengers.map((p) =>
          p.status === 'PENDING_SYNC' ? { ...p, status: 'AUTHORIZED' } : p
        ),
      },
    }));
    setTransactions((prev) =>
      prev.map((t) => (t.status === 'PENDING_SYNC' && t.shuttleId === shuttleId)
        ? { ...t, status: 'AUTHORIZED' }
        : t)
    );
  }, []);

  // ── Admin: change shuttle status ──────────────────────────────────────────

  const setShuttleStatus = useCallback((
    shuttleId: string,
    status: LiveShuttle['status'],
  ) => {
    setShuttles((prev) => ({
      ...prev,
      [shuttleId]: { ...prev[shuttleId], status },
    }));
  }, []);

  return {
    session, login, logout,
    wallets, topUpWallet,
    shuttles, startTrip, endTrip, boardPassenger, setShuttleOnline, syncOfflinePassengers, setShuttleStatus,
    transactions,
  };
}

export type AppStore = ReturnType<typeof useAppStore>;
