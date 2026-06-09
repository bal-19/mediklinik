import { describe, expect, test } from 'bun:test';
import { renderApp } from '../src/app-shell';

describe('renderApp', () => {
  test('renders pricing section on landing page', () => {
    const markup = renderApp('/');
    expect(markup.includes('Pricing yang sederhana')).toBe(true);
    expect(markup.includes('Clinic')).toBe(true);
  });

  test('renders clinic public page state', () => {
    const markup = renderApp('/klinik/klinik-sehat');
    expect(markup.includes('Klinik Sehat Sentosa')).toBe(true);
    expect(markup.includes('Daftar Antrian')).toBe(true);
  });

  test('renders blocked billing page when subscription expired', () => {
    const markup = renderApp('/app/billing/blocked');
    expect(markup.includes('Masa langganan Anda telah berakhir')).toBe(true);
    expect(markup.includes('Buka Halaman Billing')).toBe(true);
  });

  test('renders clinic midtrans settings page', () => {
    const markup = renderApp('/app/settings/midtrans');
    expect(markup.includes('Setup credential pembayaran pasien')).toBe(true);
    expect(markup.includes('Endpoint backend hanya mengembalikan flag konfigurasi')).toBe(true);
  });
});
