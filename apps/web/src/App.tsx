import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout, ProtectedRoute } from './components/layout/AppLayout';

const LandingPage = lazy(() => import('./pages/landing/LandingPage').then((module) => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then((module) => ({ default: module.LoginPage })));
const PublicClinicPage = lazy(() => import('./pages/clinic-public/PublicClinicPage').then((module) => ({ default: module.PublicClinicPage })));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const QueuesPage = lazy(() => import('./pages/admin/QueuesPage').then((module) => ({ default: module.QueuesPage })));
const MedicinesPage = lazy(() => import('./pages/admin/MedicinesPage').then((module) => ({ default: module.MedicinesPage })));
const InvoicesPage = lazy(() => import('./pages/admin/InvoicesPage').then((module) => ({ default: module.InvoicesPage })));
const BillingPage = lazy(() => import('./pages/admin/BillingPage').then((module) => ({ default: module.BillingPage })));
const ReportsPage = lazy(() => import('./pages/admin/ReportsPage').then((module) => ({ default: module.ReportsPage })));
const MedicalRecordsPage = lazy(() => import('./pages/doctor/MedicalRecordsPage').then((module) => ({ default: module.MedicalRecordsPage })));
const PatientProfilePage = lazy(() => import('./pages/patient/PatientProfilePage').then((module) => ({ default: module.PatientProfilePage })));

export function App() {
  return (
    <Suspense fallback={<main className="auth-shell"><div className="panel">Membuka MediKlinik...</div></main>}><Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/klinik/:slug" element={<PublicClinicPage />} />
      <Route path="/klinik/:slug/login" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="queues" element={<QueuesPage />} />
          <Route path="medicines" element={<MedicinesPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="billing/blocked" element={<BillingPage blocked />} />
          <Route path="medical-records" element={<MedicalRecordsPage />} />
          <Route path="profile" element={<PatientProfilePage />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>
    </Routes></Suspense>
  );
}
