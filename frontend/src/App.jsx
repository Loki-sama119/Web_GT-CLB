import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import ClubsPage from './pages/public/ClubsPage';
import ClubDetailPage from './pages/public/ClubDetailPage';
import EventsPage from './pages/public/EventsPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Dashboards
import StudentDashboard from './pages/student/StudentDashboard';
import ClubAdminDashboard from './pages/club-admin/ClubAdminDashboard';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/clubs/:slug" element={<ClubDetailPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
            </Route>

            {/* Protected Club Admin Routes */}
            <Route element={<ProtectedRoute requireClubAdmin={true} />}>
              <Route path="/club-admin" element={<ClubAdminDashboard />} />
            </Route>

            {/* Protected Super Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
              <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
