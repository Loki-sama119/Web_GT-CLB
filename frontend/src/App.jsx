import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import ClubsPage from './pages/public/ClubsPage';
import ClubDetailPage from './pages/public/ClubDetailPage';
import EventsPage from './pages/public/EventsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import TermsOfServicePage from './pages/public/TermsOfServicePage';

// Dashboards
import StudentDashboard from './pages/student/StudentDashboard';
import ClubAdminDashboard from './pages/club-admin/ClubAdminDashboard';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';

// Editorial Prototypes
import EditorialHomePrototype from './pages/prototype/EditorialHomePrototype';
import EditorialClubsPrototype from './pages/prototype/EditorialClubsPrototype';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public & Student Portal Routes (MainLayout) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/clubs/:slug" element={<ClubDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />

            {/* Public Prototypes */}
            <Route path="/prototype/editorial-home" element={<EditorialHomePrototype />} />
            <Route path="/prototype/editorial-clubs" element={<EditorialClubsPrototype />} />

            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* Protected Dedicated Admin Shell Routes (AdminLayout) */}
          <Route element={<AdminLayout />}>
            {/* Protected Club Admin Routes */}
            <Route element={<ProtectedRoute requireClubAdmin={true} />}>
              <Route path="/club-admin" element={<ClubAdminDashboard />} />
            </Route>

            {/* Protected Super Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
              <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
