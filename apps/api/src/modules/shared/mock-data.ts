import type {
  CreateQueueInput,
  DashboardSummary,
  InvoiceItemSummary,
  InvoiceSummary,
  LowStockAlert,
  MedicalRecordSummary,
  MedicineSummary,
  PayCashInput,
  QueueItemSummary,
  RevenueReportPoint,
  StockInInput,
  StockMutationSummary,
  SubscriptionSummary,
  UpdateQueueStatusInput,
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
  const currentQueue = [...queues]
    .sort((left, right) => left.queueNumber.localeCompare(right.queueNumber))
    .find((item) => item.status === 'IN_PROGRESS' || item.status === 'CALLED' || item.status === 'WAITING');

  return {
    todayQueueNumber: currentQueue?.queueNumber ?? 'A-000',
    activeQueueCount: queues.filter((item) => item.status !== 'DONE' && item.status !== 'SKIP').length,
    totalPatientsToday: queues.length,
    todayRevenue: invoices.reduce((total, invoice) => total + invoice.totalAmount, 0),
    lowStockAlerts: getLowStockAlerts(),
    subscription,
  };
}

export function createQueue(input: CreateQueueInput) {
  const highestQueueNumber = queues.reduce((highest, item) => {
    const number = Number(item.queueNumber.split('-')[1] ?? '0');
    return Math.max(highest, number);
  }, 0);

  const nextNumber = highestQueueNumber + 1;
  const queue: QueueItemSummary = {
    id: `queue_${nextNumber}`,
    clinicId: 'clinic_demo',
    patientId: input.patientId,
    queueNumber: `A-${String(nextNumber).padStart(3, '0')}`,
    status: 'WAITING',
    date: '2026-06-09',
    calledAt: null,
    doneAt: null,
  };

  queues.push(queue);
  return queue;
}

export function callNextQueue() {
  const currentInProgress = queues.find((item) => item.status === 'IN_PROGRESS');
  if (currentInProgress) {
    currentInProgress.status = 'DONE';
    currentInProgress.doneAt = new Date().toISOString();
  }

  const waitingQueue = queues.find((item) => item.status === 'WAITING');
  if (!waitingQueue) {
    throw new Error('Tidak ada antrian yang menunggu.');
  }

  waitingQueue.status = 'CALLED';
  waitingQueue.calledAt = new Date().toISOString();
  return waitingQueue;
}

export function updateQueueStatus(queueId: string, input: UpdateQueueStatusInput) {
  const queue = queues.find((item) => item.id === queueId);
  if (!queue) {
    throw new Error('Antrian tidak ditemukan.');
  }

  queue.status = input.status;
  if (input.status === 'CALLED' && !queue.calledAt) {
    queue.calledAt = new Date().toISOString();
  }
  if (input.status === 'DONE') {
    queue.doneAt = new Date().toISOString();
  }

  return queue;
}

export function stockInMedicine(medicineId: string, input: StockInInput) {
  const medicine = medicines.find((item) => item.id === medicineId);
  if (!medicine) {
    throw new Error('Obat tidak ditemukan.');
  }

  medicine.stockQuantity += input.quantity;

  const mutation: StockMutationSummary = {
    id: `mut_${stockMutations.length + 1}`,
    clinicId: medicine.clinicId,
    medicineId,
    type: 'IN',
    quantity: input.quantity,
    referenceId: null,
    notes: input.notes,
    createdAt: new Date().toISOString(),
  };

  stockMutations.unshift(mutation);

  return {
    medicine,
    mutation,
  };
}

export function payInvoiceCash(invoiceId: string, input: PayCashInput) {
  const invoice = invoices.find((item) => item.id === invoiceId);
  if (!invoice) {
    throw new Error('Invoice tidak ditemukan.');
  }

  invoice.status = input.amountPaid >= invoice.totalAmount ? 'PAID' : 'PARTIAL';
  invoice.paymentMethod = 'CASH';
  invoice.paidAt = new Date().toISOString();

  return invoice;
}

export function createInvoiceFromMedicalRecord(medicalRecordId: string) {
  const record = medicalRecords.find((item) => item.id === medicalRecordId);
  if (!record) {
    throw new Error('Rekam medis tidak ditemukan.');
  }

  const items: InvoiceItemSummary[] = [
    {
      id: `item_${Date.now()}_1`,
      description: 'Konsultasi Dokter Umum',
      quantity: 1,
      unitPrice: 100000,
      subtotal: 100000,
    },
    {
      id: `item_${Date.now()}_2`,
      description: 'Paket Obat Dasar',
      quantity: 1,
      unitPrice: 35000,
      subtotal: 35000,
    },
  ];

  const totalAmount = items.reduce((total, item) => total + item.subtotal, 0);
  const nextId = invoices.length + 1;

  const invoice: InvoiceSummary = {
    id: `inv_${nextId}`,
    clinicId: record.clinicId,
    patientId: record.patientId,
    medicalRecordId,
    totalAmount,
    status: 'UNPAID',
    paymentMethod: null,
    midtransOrderId: `klinik-sehat-INV-${String(nextId).padStart(3, '0')}`,
    paidAt: null,
    createdAt: new Date().toISOString(),
    items,
  };

  invoices.unshift(invoice);
  return invoice;
}
