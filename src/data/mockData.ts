export type TransactionStatus =
  | 'AUTHORIZED'
  | 'COMPLETED'
  | 'PENDING_SYNC'
  | 'FAILED'
  | 'OUTSTANDING'
  | 'CANCELLED'
  | 'SYNCHRONIZED';

export type TripStatus = 'BOARDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Student {
  studentId: string;
  name: string;
  program: string;
  year: number;
  email: string;
  walletId: string;
  qrPayload: string;
  avatarInitials: string;
}

export interface Wallet {
  walletId: string;
  studentId: string;
  balance: number;
  outstandingDues: number;
}

export interface Shuttle {
  shuttleId: string;
  number: string;
  route: string;
  capacity: number;
  driverName: string;
  status: 'ACTIVE' | 'IDLE' | 'MAINTENANCE';
}

export interface Transaction {
  transactionId: string;
  studentId: string;
  shuttleId: string;
  amount: number;
  timestamp: string;
  status: TransactionStatus;
  tripId: string;
  deviceId: string;
}

export interface Trip {
  tripId: string;
  shuttleId: string;
  startTime: string;
  endTime?: string;
  status: TripStatus;
  passengerIds: string[];
}

export interface Passenger {
  studentId: string;
  name: string;
  program: string;
  transactionId: string;
  status: TransactionStatus;
  boardedAt: string;
}

export const FARE = 20;

export const students: Student[] = [
  {
    studentId: 'VIT2021001',
    name: 'Arjun Sharma',
    program: 'B.Tech CSE',
    year: 3,
    email: 'arjun.sharma@vitstudent.ac.in',
    walletId: 'WLT-001',
    qrPayload: 'VIT-STUDENT::VIT2021001::ARJUN_SHARMA::HMAC-a7f3c',
    avatarInitials: 'AS',
  },
  {
    studentId: 'VIT2022042',
    name: 'Priya Nair',
    program: 'B.Tech ECE',
    year: 2,
    email: 'priya.nair@vitstudent.ac.in',
    walletId: 'WLT-002',
    qrPayload: 'VIT-STUDENT::VIT2022042::PRIYA_NAIR::HMAC-b9e1d',
    avatarInitials: 'PN',
  },
  {
    studentId: 'VIT2020087',
    name: 'Rohan Mehta',
    program: 'B.Tech Mech',
    year: 4,
    email: 'rohan.mehta@vitstudent.ac.in',
    walletId: 'WLT-003',
    qrPayload: 'VIT-STUDENT::VIT2020087::ROHAN_MEHTA::HMAC-c2a9f',
    avatarInitials: 'RM',
  },
  {
    studentId: 'VIT2023015',
    name: 'Sneha Reddy',
    program: 'B.Tech IT',
    year: 1,
    email: 'sneha.reddy@vitstudent.ac.in',
    walletId: 'WLT-004',
    qrPayload: 'VIT-STUDENT::VIT2023015::SNEHA_REDDY::HMAC-d5b2e',
    avatarInitials: 'SR',
  },
  {
    studentId: 'VIT2021099',
    name: 'Karthik Iyer',
    program: 'M.Tech VLSI',
    year: 1,
    email: 'karthik.iyer@vitstudent.ac.in',
    walletId: 'WLT-005',
    qrPayload: 'VIT-STUDENT::VIT2021099::KARTHIK_IYER::HMAC-e8c4a',
    avatarInitials: 'KI',
  },
];

export const wallets: Wallet[] = [
  { walletId: 'WLT-001', studentId: 'VIT2021001', balance: 180, outstandingDues: 0 },
  { walletId: 'WLT-002', studentId: 'VIT2022042', balance: 20, outstandingDues: 0 },
  { walletId: 'WLT-003', studentId: 'VIT2020087', balance: 5, outstandingDues: 20 },
  { walletId: 'WLT-004', studentId: 'VIT2023015', balance: 340, outstandingDues: 0 },
  { walletId: 'WLT-005', studentId: 'VIT2021099', balance: 0, outstandingDues: 40 },
];

export const shuttles: Shuttle[] = [
  {
    shuttleId: 'SHT-01',
    number: 'VIT-01',
    route: 'Main Gate → Tech Tower → Hostel Block A',
    capacity: 40,
    driverName: 'Murugan R.',
    status: 'ACTIVE',
  },
  {
    shuttleId: 'SHT-02',
    number: 'VIT-02',
    route: 'Hostel Block B → Library → Admin Block',
    capacity: 40,
    driverName: 'Selvam K.',
    status: 'ACTIVE',
  },
  {
    shuttleId: 'SHT-03',
    number: 'VIT-03',
    route: 'Sports Complex → GDN → Main Gate',
    capacity: 30,
    driverName: 'Rajan P.',
    status: 'IDLE',
  },
];

export const transactions: Transaction[] = [
  {
    transactionId: 'TXN-20240918-001',
    studentId: 'VIT2021001',
    shuttleId: 'SHT-01',
    amount: 20,
    timestamp: '2024-09-18T08:15:00',
    status: 'COMPLETED',
    tripId: 'TRIP-001',
    deviceId: 'DEV-SHT-01',
  },
  {
    transactionId: 'TXN-20240918-002',
    studentId: 'VIT2022042',
    shuttleId: 'SHT-01',
    amount: 20,
    timestamp: '2024-09-18T08:17:00',
    status: 'COMPLETED',
    tripId: 'TRIP-001',
    deviceId: 'DEV-SHT-01',
  },
  {
    transactionId: 'TXN-20240918-003',
    studentId: 'VIT2020087',
    shuttleId: 'SHT-01',
    amount: 20,
    timestamp: '2024-09-18T12:30:00',
    status: 'OUTSTANDING',
    tripId: 'TRIP-003',
    deviceId: 'DEV-SHT-01',
  },
  {
    transactionId: 'TXN-20240917-001',
    studentId: 'VIT2021001',
    shuttleId: 'SHT-02',
    amount: 20,
    timestamp: '2024-09-17T09:00:00',
    status: 'COMPLETED',
    tripId: 'TRIP-004',
    deviceId: 'DEV-SHT-02',
  },
  {
    transactionId: 'TXN-20240917-002',
    studentId: 'VIT2021001',
    shuttleId: 'SHT-01',
    amount: 20,
    timestamp: '2024-09-17T17:45:00',
    status: 'COMPLETED',
    tripId: 'TRIP-005',
    deviceId: 'DEV-SHT-01',
  },
  {
    transactionId: 'TXN-20240916-001',
    studentId: 'VIT2021099',
    shuttleId: 'SHT-02',
    amount: 20,
    timestamp: '2024-09-16T10:10:00',
    status: 'OUTSTANDING',
    tripId: 'TRIP-006',
    deviceId: 'DEV-SHT-02',
  },
];

export const trips: Trip[] = [
  {
    tripId: 'TRIP-001',
    shuttleId: 'SHT-01',
    startTime: '2024-09-18T08:10:00',
    endTime: '2024-09-18T08:45:00',
    status: 'COMPLETED',
    passengerIds: ['VIT2021001', 'VIT2022042'],
  },
  {
    tripId: 'TRIP-003',
    shuttleId: 'SHT-01',
    startTime: '2024-09-18T12:25:00',
    status: 'IN_PROGRESS',
    passengerIds: ['VIT2020087'],
  },
];

export function getStudentById(id: string): Student | undefined {
  return students.find((s) => s.studentId === id);
}

export function getWalletByStudentId(id: string): Wallet | undefined {
  return wallets.find((w) => w.studentId === id);
}

export function getTransactionsByStudentId(id: string): Transaction[] {
  return transactions.filter((t) => t.studentId === id);
}

export function getShuttleById(id: string): Shuttle | undefined {
  return shuttles.find((s) => s.shuttleId === id);
}

export function validateQRPayload(payload: string): Student | null {
  const student = students.find((s) => s.qrPayload === payload);
  return student ?? null;
}
