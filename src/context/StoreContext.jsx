import { createContext, useContext, useMemo, useState } from "react"
import {
  initialServices,
  initialUsers,
  generateCustomers,
  generateTransactions,
} from "../lib/data.js"

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [services, setServices] = useState(initialServices)
  const [users, setUsers] = useState(initialUsers)
  const [customers, setCustomers] = useState(() => generateCustomers(30))
  const [transactions, setTransactions] = useState(() =>
    generateTransactions(generateCustomers(30), initialServices, 50),
  )

  // ------- Transactions -------
  function addTransaction(tx) {
    const nextId = transactions.reduce((m, t) => Math.max(m, t.id), 0) + 1
    const invoice = `INV-${String(2500 + nextId).padStart(5, "0")}`
    const newTx = { ...tx, id: nextId, invoice }
    setTransactions((prev) => [newTx, ...prev])
    return newTx
  }
  function updateTransaction(id, patch) {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  }
  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  // ------- Customers -------
  function addCustomer(c) {
    const nextId = customers.reduce((m, x) => Math.max(m, x.id), 0) + 1
    const newC = { ...c, id: nextId, createdAt: new Date().toISOString().slice(0, 10) }
    setCustomers((prev) => [newC, ...prev])
    return newC
  }
  function updateCustomer(id, patch) {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }
  function deleteCustomer(id) {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  // ------- Users -------
  function addUser(u) {
    const nextId = users.reduce((m, x) => Math.max(m, x.id), 0) + 1
    setUsers((prev) => [...prev, { ...u, id: nextId }])
  }
  function updateUser(id, patch) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)))
  }
  function deleteUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  // ------- Services -------
  function updateService(id, patch) {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const value = useMemo(
    () => ({
      services,
      users,
      customers,
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addUser,
      updateUser,
      deleteUser,
      updateService,
    }),
    [services, users, customers, transactions],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
