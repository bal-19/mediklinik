import type { InvoiceSummary, PayCashInput } from '@mediklinik/types';
import type { InvoicesRepositoryContract } from '../contracts';
import { getSupabaseAdminClient } from '../../shared/supabase-client';
import { requireClinicId } from './utils';

interface InvoiceRow {
  id: string;
  clinic_id: string;
  patient_id: string;
  medical_record_id: string | null;
  total_amount: number;
  status: 'DRAFT' | 'UNPAID' | 'PARTIAL' | 'PAID' | 'VOID';
  payment_method: string | null;
  midtrans_order_id: string | null;
  paid_at: string | null;
  created_at: string;
}

interface InvoiceItemRow {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export class SupabaseInvoicesRepository implements InvoicesRepositoryContract {
  async list(): Promise<InvoiceSummary[]> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();

    const { data, error } = await client
      .from('invoices')
      .select(`
        id, clinic_id, patient_id, medical_record_id, total_amount, status, payment_method, midtrans_order_id, paid_at, created_at,
        invoice_items (id, description, quantity, unit_price, subtotal)
      `)
      .eq('clinic_id', clinicId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Gagal mengambil invoice: ${error.message}`);
    }

    return (data ?? []).map(mapInvoiceRow);
  }

  async findById(invoiceId: string): Promise<InvoiceSummary> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();

    const { data, error } = await client
      .from('invoices')
      .select(`
        id, clinic_id, patient_id, medical_record_id, total_amount, status, payment_method, midtrans_order_id, paid_at, created_at,
        invoice_items (id, description, quantity, unit_price, subtotal)
      `)
      .eq('id', invoiceId)
      .eq('clinic_id', clinicId)
      .single();

    if (error || !data) {
      throw new Error(`Gagal mengambil detail invoice: ${error?.message ?? 'data tidak ditemukan.'}`);
    }

    return mapInvoiceRow(data);
  }

  async payCash(invoiceId: string, input: PayCashInput): Promise<InvoiceSummary> {
    const invoice = await this.findById(invoiceId);
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();
    const nextStatus = input.amountPaid >= invoice.totalAmount ? 'PAID' : 'PARTIAL';

    const { data, error } = await client
      .from('invoices')
      .update({
        status: nextStatus,
        payment_method: 'CASH',
        paid_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .eq('clinic_id', clinicId)
      .select(`
        id, clinic_id, patient_id, medical_record_id, total_amount, status, payment_method, midtrans_order_id, paid_at, created_at,
        invoice_items (id, description, quantity, unit_price, subtotal)
      `)
      .single();

    if (error || !data) {
      throw new Error(`Gagal mencatat pembayaran tunai: ${error?.message ?? 'update tidak mengembalikan data.'}`);
    }

    return mapInvoiceRow(data);
  }

  async createFromMedicalRecord(medicalRecordId: string): Promise<InvoiceSummary> {
    const client = getSupabaseAdminClient();
    const clinicId = requireClinicId();

    const { data: record, error: recordError } = await client
      .from('medical_records')
      .select('id, clinic_id, patient_id')
      .eq('id', medicalRecordId)
      .eq('clinic_id', clinicId)
      .single();

    if (recordError || !record) {
      throw new Error(`Gagal mengambil rekam medis untuk invoice: ${recordError?.message ?? 'data tidak ditemukan.'}`);
    }

    const items = [
      { description: 'Konsultasi Dokter Umum', quantity: 1, unit_price: 100000, subtotal: 100000 },
      { description: 'Paket Obat Dasar', quantity: 1, unit_price: 35000, subtotal: 35000 },
    ];
    const totalAmount = items.reduce((total, item) => total + item.subtotal, 0);

    const { count } = await client
      .from('invoices')
      .select('id', { count: 'exact', head: true })
      .eq('clinic_id', clinicId);

    const nextNumber = (count ?? 0) + 1;
    const orderId = `klinik-sehat-INV-${String(nextNumber).padStart(3, '0')}`;

    const { data: invoiceRow, error: invoiceError } = await client
      .from('invoices')
      .insert({
        clinic_id: clinicId,
        patient_id: record.patient_id,
        medical_record_id: medicalRecordId,
        total_amount: totalAmount,
        status: 'UNPAID',
        payment_method: null,
        midtrans_order_id: orderId,
      })
      .select('id, clinic_id, patient_id, medical_record_id, total_amount, status, payment_method, midtrans_order_id, paid_at, created_at')
      .single();

    if (invoiceError || !invoiceRow) {
      throw new Error(`Gagal membuat invoice: ${invoiceError?.message ?? 'insert tidak mengembalikan data.'}`);
    }

    const { error: itemError } = await client.from('invoice_items').insert(
      items.map((item) => ({
        invoice_id: invoiceRow.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      })),
    );

    if (itemError) {
      throw new Error(`Gagal membuat item invoice: ${itemError.message}`);
    }

    return this.findById(invoiceRow.id);
  }
}

function mapInvoiceRow(
  row: InvoiceRow & {
    invoice_items?: InvoiceItemRow[] | null;
  },
): InvoiceSummary {
  return {
    id: row.id,
    clinicId: row.clinic_id,
    patientId: row.patient_id,
    medicalRecordId: row.medical_record_id,
    totalAmount: row.total_amount,
    status: row.status,
    paymentMethod: row.payment_method,
    midtransOrderId: row.midtrans_order_id,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    items: (row.invoice_items ?? []).map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      subtotal: item.subtotal,
    })),
  };
}
