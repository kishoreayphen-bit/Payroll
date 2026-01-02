import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
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

function App() {
  return (
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
            path="/settings/pay-schedule"
            element={
              <ProtectedRoute>
                <ComingSoon
                  title="Pay Schedule Configuration"
                  description="Configure your payroll schedule, pay periods, and payment dates for your organization."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/statutory"
            element={
              <ProtectedRoute>
                <ComingSoon
                  title="Statutory Components Setup"
                  description="Configure statutory components like PF, ESI, LWF, and Professional Tax for compliance."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/salary-components"
            element={
              <ProtectedRoute>
                <ComingSoon
                  title="Salary Components Setup"
                  description="Define and configure salary components, allowances, and deductions for your payroll."
                />
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
  )
}

export default App
