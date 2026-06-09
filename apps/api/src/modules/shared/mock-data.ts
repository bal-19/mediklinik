import type {
  DashboardSummary,
  InvoiceSummary,
  LowStockAlert,
  MedicalRecordSummary,
  MedicineSummary,
  QueueItemSummary,
  RevenueReportPoint,
  StockMutationSummary,
  SubscriptionSummary,
  VisitReportPoint,
} from '@mediklinik/types';

const subscription: SubscriptionSummary = {
  status: 'TRIAL',
  plan: 'CLINIC',
  trialExpiresAt: '2026-06-23T00:00:00.000Z',
  subscriptionExpiresAt: null,
  daysRemaining: 14,
};

export const queues: QueueItemSummary[] = [
  {
    id: 'queue_1',
    clinicId: 'clinic_demo',
    patientId: 'patient_1',
    queueNumber: 'A-021',
    status: 'WAITING',
    date: '2026-06-09',
    calledAt: null,
    doneAt: null,
  },
  {
    id: 'queue_2',
    clinicId: 'clinic_demo',
    patientId: 'patient_2',
    queueNumber: 'A-022',
    status: 'CALLED',
    date: '2026-06-09',
    calledAt: '2026-06-09T08:40:00.000Z',
    doneAt: null,
  },
  {
    id: 'queue_3',
    clinicId: 'clinic_demo',
    patientId: 'patient_3',
    queueNumber: 'A-023',
    status: 'IN_PROGRESS',
    date: '2026-06-09',
    calledAt: '2026-06-09T08:45:00.000Z',
    doneAt: null,
  },
];

export const medicalRecords: MedicalRecordSummary[] = [
  {
    id: 'mr_1',
    clinicId: 'clinic_demo',
    patientId: 'patient_1',
    doctorId: 'doctor_1',
    queueId: 'queue_1',
    chiefComplaint: 'Demam dan batuk 3 hari',
    diagnosis: 'Infeksi saluran napas atas',
    notes: 'Istirahat, hidrasi, kontrol 3 hari jika belum membaik.',
    createdAt: '2026-06-09T08:50:00.000Z',
    lockedAt: null,
  },
];

export const medicines: MedicineSummary[] = [
  {
    id: 'med_1',
    clinicId: 'clinic_demo',
    name: 'Amoxicillin',
    unit: 'strip',
    stockQuantity: 8,
    minStockAlert: 10,
    purchasePrice: 12000,
    sellPrice: 18000,
    isActive: true,
  },
  {
    id: 'med_2',
    clinicId: 'clinic_demo',
    name: 'Paracetamol',
    unit: 'strip',
    stockQuantity: 42,
    minStockAlert: 15,
    purchasePrice: 6000,
    sellPrice: 12000,
    isActive: true,
  },
];

export const stockMutations: StockMutationSummary[] = [
  {
    id: 'mut_1',
    clinicId: 'clinic_demo',
    medicineId: 'med_1',
    type: 'OUT',
    quantity: 2,
    referenceId: 'pres_1',
    notes: 'Resep pasien',
    createdAt: '2026-06-09T08:52:00.000Z',
  },
  {
    id: 'mut_2',
    clinicId: 'clinic_demo',
    medicineId: 'med_2',
    type: 'IN',
    quantity: 20,
    referenceId: null,
    notes: 'Restock supplier',
    createdAt: '2026-06-08T10:00:00.000Z',
  },
];

export const invoices: InvoiceSummary[] = [
  {
    id: 'inv_1',
    clinicId: 'clinic_demo',
    patientId: 'patient_1',
    medicalRecordId: 'mr_1',
    totalAmount: 156000,
    status: 'UNPAID',
    paymentMethod: null,
    midtransOrderId: 'klinik-sehat-INV-001',
    paidAt: null,
    createdAt: '2026-06-09T09:00:00.000Z',
    items: [
      {
        id: 'item_1',
        description: 'Konsultasi Dokter Umum',
        quantity: 1,
        unitPrice: 100000,
        subtotal: 100000,
      },
      {
        id: 'item_2',
        description: 'Amoxicillin',
        quantity: 2,
        unitPrice: 18000,
        subtotal: 36000,
      },
      {
        id: 'item_3',
        description: 'Paracetamol',
        quantity: 1,
        unitPrice: 20000,
        subtotal: 20000,
      },
    ],
  },
];

export const visitReport: VisitReportPoint[] = [
  { month: 'Jan', totalVisits: 122 },
  { month: 'Feb', totalVisits: 134 },
  { month: 'Mar', totalVisits: 148 },
  { month: 'Apr', totalVisits: 140 },
  { month: 'May', totalVisits: 164 },
  { month: 'Jun', totalVisits: 171 },
];

export const revenueReport: RevenueReportPoint[] = [
  { month: 'Jan', totalRevenue: 12400000 },
  { month: 'Feb', totalRevenue: 13650000 },
  { month: 'Mar', totalRevenue: 14220000 },
  { month: 'Apr', totalRevenue: 13980000 },
  { month: 'May', totalRevenue: 15600000 },
  { month: 'Jun', totalRevenue: 16850000 },
];

export function getLowStockAlerts(): LowStockAlert[] {
  return medicines
    .filter((medicine) => medicine.stockQuantity <= medicine.minStockAlert)
    .map((medicine) => ({
      medicineId: medicine.id,
      medicineName: medicine.name,
      stockQuantity: medicine.stockQuantity,
      minStockAlert: medicine.minStockAlert,
    }));
}

export function getDashboardSummary(): DashboardSummary {
  return {
    todayQueueNumber: 'A-023',
    activeQueueCount: queues.filter((item) => item.status !== 'DONE' && item.status !== 'SKIP').length,
    totalPatientsToday: queues.length,
    todayRevenue: invoices.reduce((total, invoice) => total + invoice.totalAmount, 0),
    lowStockAlerts: getLowStockAlerts(),
    subscription,
  };
}
