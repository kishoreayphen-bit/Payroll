import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './components/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import TenantRegister from './pages/TenantRegister'
import OrganizationList from './pages/OrganizationList'
import OrganizationSelect from './pages/OrganizationSelect'
import Dashboard from './pages/Dashboard'
import EmployeeList from './pages/EmployeeList'
import EmployeeDetails from './pages/EmployeeDetails'
import AddEmployee from './pages/AddEmployee'
import SalaryComponents from './pages/SalaryComponents'
import TestOrganizations from './pages/TestOrganizations'
import ComingSoon from './pages/ComingSoon'
import Notifications from './pages/Notifications'
import PayScheduleSettings from './pages/PayScheduleSettings'
import PayRun from './pages/PayRun'
import StatutoryCompliance from './pages/StatutoryCompliance'
import Settings from './pages/Settings'
import AttendanceLeave from './pages/AttendanceLeave'
import EmployeeFeatures from './pages/EmployeeFeatures'
import Reports from './pages/Reports'
import AdvancedFeatures from './pages/AdvancedFeatures'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/organizations"
            element={
              <ProtectedRoute>
                <OrganizationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/select-organization"
            element={
              <ProtectedRoute>
                <OrganizationSelect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tenant/register"
            element={
              <ProtectedRoute>
                <TenantRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <EmployeeList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <ProtectedRoute>
                <EmployeeDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/add"
            element={
              <ProtectedRoute>
                <AddEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test-organizations"
            element={
              <ProtectedRoute>
                <TestOrganizations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salary-components"
            element={
              <ProtectedRoute>
                <SalaryComponents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pay-runs"
            element={
              <ProtectedRoute>
                <PayRun />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendanceLeave />
              </ProtectedRoute>
            }
          />
          <Route
            path="/benefits"
            element={
              <ProtectedRoute>
                <EmployeeFeatures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/advanced"
            element={
              <ProtectedRoute>
                <AdvancedFeatures />
              </ProtectedRoute>
            }
          />
          <Route
            path="/form16"
            element={
              <ProtectedRoute>
                <AdvancedFeatures />
              </ProtectedRoute>
            }
          />

          {/* Coming Soon Pages */}
          <Route
            path="/settings/tax-details"
            element={
              <ProtectedRoute>
                <ComingSoon
                  title="Tax Details Configuration"
                  description="Set up your organization's tax details including TDS, GST, and other statutory tax information."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/pay-schedule"
            element={
              <ProtectedRoute>
                <PayScheduleSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/statutory"
            element={
              <ProtectedRoute>
                <StatutoryCompliance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/prior-payroll"
            element={
              <ProtectedRoute>
                <ComingSoon
                  title="Prior Payroll Configuration"
                  description="Import and configure prior payroll data for accurate year-to-date calculations."
                />
              </ProtectedRoute>
            }
          />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
