import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { Layout } from '@/components/Layout'
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/AdminLayout'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Signup } from '@/pages/Signup'
import { Dashboard } from '@/pages/Dashboard'
import { CreatePoster } from '@/pages/CreatePoster'
import { PosterDetail } from '@/pages/PosterDetail'
import { Pricing } from '@/pages/Pricing'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminUsers } from '@/pages/admin/AdminUsers'
import { AdminPricing } from '@/pages/admin/AdminPricing'
import { AdminPackages } from '@/pages/admin/AdminPackages'
import { AdminThemes } from '@/pages/admin/AdminThemes'
import { AdminResolutions } from '@/pages/admin/AdminResolutions'
import { AdminJobs } from '@/pages/admin/AdminJobs'
import { AdminSettings } from '@/pages/admin/AdminSettings'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<Pricing />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute><CreatePoster /></ProtectedRoute>} />
            <Route path="/poster/:id" element={<ProtectedRoute><PosterDetail /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminLayout /></AdminRoute></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="themes" element={<AdminThemes />} />
              <Route path="resolutions" element={<AdminResolutions />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
