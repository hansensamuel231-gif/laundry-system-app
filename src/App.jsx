import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { StoreProvider } from "./context/StoreContext"
import ProtectedRoute from "./components/ProtectedRoute"
import { AppLayout } from "./components/layout/AppLayout"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import NewTransaction from "./pages/NewTransaction"
import TransactionList from "./pages/TransactionList"
import Customers from "./pages/Customers"
import Reports from "./pages/Reports"
import Pricing from "./pages/Pricing"
import UserManagement from "./pages/UserManagement"

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transaksi/baru" element={<NewTransaction />} />
            <Route path="/transaksi" element={<TransactionList />} />
            <Route path="/pelanggan" element={<Customers />} />
            <Route path="/laporan" element={<Reports />} />
            <Route path="/pengaturan/harga" element={<Pricing />} />
            <Route path="/pengaturan/user" element={<UserManagement />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </StoreProvider>
    </AuthProvider>
  )
}
