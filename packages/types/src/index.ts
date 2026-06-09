export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'PATIENT';

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'SUSPENDED';
export type SubscriptionPlan = 'STARTER' | 'CLINIC' | 'PRO';
export type QueueStatus = 'WAITING' | 'CALLED' | 'IN_PROGRESS' | 'DONE' | 'SKIP';
export type InvoiceStatus = 'DRAFT' | 'UNPAID' | 'PARTIAL' | 'PAID' | 'VOID';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<Record<string, unknown>>;
}

export interface DashboardUser {
  id: string;
  clinicId: string;
  email: string;
  fullName: string;
  role: Role;
  subscriptionStatus: SubscriptionStatus;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: DashboardUser;
}

export interface ClinicSummary {
  id: string;
  slug: string;
  name: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan: SubscriptionPlan;
  trialExpiresAt: string | null;
  subscriptionExpiresAt: string | null;
  isMidtransConfigured: boolean;
}

export interface ClinicPublicPage {
  slug: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  openHours: Record<string, string>;
  subscriptionStatus: SubscriptionStatus;
  isPublicPageVisible: boolean;
}

export interface ClinicDoctorCard {
  id: string;
  name: string;
  specialization: string;
  practiceSchedule: string[];
}

export interface SubscriptionSummary {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  trialExpiresAt: string | null;
  subscriptionExpiresAt: string | null;
  daysRemaining: number;
}

export interface QueueItemSummary {
  id: string;
  clinicId: string;
  patientId: string;
  queueNumber: string;
  status: QueueStatus;
  date: string;
  calledAt: string | null;
  doneAt: string | null;
}

export interface InvoiceItemSummary {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SubscriptionPaymentSummary {
  id: string;
  clinicId: string;
  plan: SubscriptionPlan;
  amount: number;
  status: PaymentStatus;
  periodStart: string;
  periodEnd: string;
  paidAt: string | null;
}

export interface LowStockAlert {
  medicineId: string;
  medicineName: string;
  stockQuantity: number;
  minStockAlert: number;
}

export interface MedicineSummary {
  id: string;
  clinicId: string;
  name: string;
  unit: string;
  stockQuantity: number;
  minStockAlert: number;
  purchasePrice: number;
  sellPrice: number;
  isActive: boolean;
}

export interface StockMutationSummary {
  id: string;
  clinicId: string;
  medicineId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  referenceId: string | null;
  notes: string;
  createdAt: string;
}

export interface MedicalRecordSummary {
  id: string;
  clinicId: string;
  patientId: string;
  doctorId: string;
  queueId: string | null;
  chiefComplaint: string;
  diagnosis: string;
  notes: string;
  createdAt: string;
  lockedAt: string | null;
}

export interface InvoiceSummary {
  id: string;
  clinicId: string;
  patientId: string;
  medicalRecordId: string | null;
  totalAmount: number;
  status: InvoiceStatus;
  paymentMethod: string | null;
  midtransOrderId: string | null;
  paidAt: string | null;
  createdAt: string;
  items: InvoiceItemSummary[];
}

export interface VisitReportPoint {
  month: string;
  totalVisits: number;
}

export interface RevenueReportPoint {
  month: string;
  totalRevenue: number;
}

export interface DashboardSummary {
  todayQueueNumber: string;
  activeQueueCount: number;
  totalPatientsToday: number;
  todayRevenue: number;
  lowStockAlerts: LowStockAlert[];
  subscription: SubscriptionSummary;
}
