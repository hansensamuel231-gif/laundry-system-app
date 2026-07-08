import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Receipt,
  Loader,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  Search,
  Users,
  TrendingUp,
  Wallet,
  Check,
  Package,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts"
import { useStore } from "../context/StoreContext.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { PageHeader } from "../components/ui/PageHeader.jsx"
import { StatCard } from "../components/ui/StatCard.jsx"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx"
import { StatusBadge } from "../components/ui/StatusBadge.jsx"
import { Button } from "../components/ui/Button.jsx"
import { formatCurrency, formatDate } from "../lib/utils.js"

export default function Dashboard() {
  const { user } = useAuth()

  if (user?.role === "Admin") {
    return <AdminDashboard />
  }

  return <KasirDashboard />
}

// ================= ADMIN DASHBOARD =================
function AdminDashboard() {
  const { transactions, customers } = useStore()
  const { user } = useAuth()

  // Get current year and month in YYYY-MM format (e.g. "2026-07")
  const currentMonthStr = useMemo(() => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    return `${year}-${month}`
  }, [])

  // 1. Calculations for Admin Stats
  const stats = useMemo(() => {
    const monthlyTx = transactions.filter((t) => t.date.startsWith(currentMonthStr))
    const totalTxMonth = monthlyTx.length
    const totalRevenueMonth = monthlyTx.reduce((sum, t) => sum + t.price, 0)
    const activeLaundryCount = transactions.filter((t) => t.status === "Proses").length
    
    // Unique customer count in total (active customers in system)
    const totalActiveCustomers = customers.length

    return {
      totalTxMonth,
      totalRevenueMonth,
      activeLaundry: activeLaundryCount,
      activeCustomers: totalActiveCustomers,
    }
  }, [transactions, customers, currentMonthStr])

  // 2. 7-Day revenue trend chart
  const weeklyData = useMemo(() => {
    const days = []
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
    // Generate past 7 days up to today
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().slice(0, 10)
      const dayName = dayNames[d.getDay()]
      const dailyTx = transactions.filter((t) => t.date === dateStr)
      const omset = dailyTx.reduce((sum, t) => sum + t.price, 0)
      days.push({ day: dayName, omset })
    }
    return days
  }, [transactions])

  // 3. Most Popular Service Type Chart data
  const popularServices = useMemo(() => {
    const counts = {}
    transactions.forEach((t) => {
      counts[t.serviceName] = (counts[t.serviceName] || 0) + 1
    })
    
    // Pre-defined color palette for chart bars
    const colors = ["#2563eb", "#06b6d4", "#10b981", "#f59e0b", "#6366f1", "#ec4899"]
    
    return Object.entries(counts)
      .map(([name, count], index) => ({
        name,
        count,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.count - a.count)
  }, [transactions])

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5)
  }, [transactions])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Halo, ${user?.name || "Admin"}!`}
        description="Ringkasan eksekutif dan tren performa Zahra Laundry."
      />

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Transaksi Bulan Ini"
          value={stats.totalTxMonth}
          icon={Receipt}
          tone="blue"
          hint="Jumlah order bulan berjalan"
        />
        <StatCard
          label="Pendapatan Bulan Ini"
          value={formatCurrency(stats.totalRevenueMonth)}
          icon={TrendingUp}
          tone="green"
          hint="Total omset bruto bulan ini"
        />
        <StatCard
          label="Cucian Proses"
          value={stats.activeLaundry}
          icon={Loader}
          tone="yellow"
          hint="Sedang dicuci / disetrika"
        />
        <StatCard
          label="Pelanggan Aktif"
          value={stats.activeCustomers}
          icon={Users}
          tone="purple"
          hint="Pelanggan terdaftar"
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Revenue Line/Bar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Tren Pendapatan 7 Hari Terakhir
            </CardTitle>
            <p className="text-xs text-muted-foreground">Analisis omset harian</p>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => (v >= 1000000 ? `${v / 1000000}jt` : `${v / 1000}k`)}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-muted)" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      fontSize: 13,
                      backgroundColor: "var(--color-card)",
                    }}
                    formatter={(v) => [formatCurrency(v), "Pendapatan"]}
                  />
                  <Bar dataKey="omset" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Popular Service Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" /> Layanan Terpopuler
            </CardTitle>
            <p className="text-xs text-muted-foreground">Distribusi jenis layanan terlaris</p>
          </CardHeader>
          <CardContent>
            {popularServices.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-10">Belum ada data transaksi</p>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularServices} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                    <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="var(--color-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--color-border)",
                        fontSize: 12,
                      }}
                      formatter={(v) => [v, "Transaksi"]}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
                      {popularServices.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <p className="text-xs text-muted-foreground">5 order laundry terakhir masuk</p>
          </div>
          <Link
            to="/transaksi"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Lihat semua <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Invoice</th>
                  <th className="pb-3 pr-4 font-medium">Pelanggan</th>
                  <th className="pb-3 pr-4 font-medium">Tanggal</th>
                  <th className="pb-3 pr-4 font-medium">Layanan</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 text-right font-medium">Harga</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="py-3 pr-4 font-semibold text-primary">{t.invoice}</td>
                    <td className="py-3 pr-4">{t.customerName}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{formatDate(t.date)}</td>
                    <td className="py-3 pr-4">{t.serviceName}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="py-3 text-right font-semibold">{formatCurrency(t.price)}</td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Belum ada transaksi terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ================= KASIR DASHBOARD =================
function KasirDashboard() {
  const { transactions, updateTransaction } = useStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Toast state
  const [toast, setToast] = useState(null)
  
  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  // Today's date string ISO (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    return new Date().toISOString().slice(0, 10)
  }, [])

  // Calculations for Kasir stats
  const stats = useMemo(() => {
    const todayTx = transactions.filter((t) => t.date === todayStr)
    const countToday = todayTx.length
    const countProses = transactions.filter((t) => t.status === "Proses").length
    const countSelesaiToday = transactions.filter((t) => t.status === "Selesai" && t.date === todayStr).length
    const countPending = transactions.filter((t) => t.status === "Pending").length

    return {
      todayTxCount: countToday,
      cucianProsesCount: countProses,
      selesaiTodayCount: countSelesaiToday,
      pendingBayarCount: countPending,
    }
  }, [transactions, todayStr])

  // Queue of clothes in process (status === "Proses")
  const processQueue = useMemo(() => {
    return transactions.filter((t) => t.status === "Proses")
  }, [transactions])

  // Today's transactions
  const todayTransactions = useMemo(() => {
    return transactions.filter((t) => t.date === todayStr)
  }, [transactions, todayStr])

  // Quick Action to update status to Selesai
  const handleMarkAsSelesai = (id, invoice) => {
    updateTransaction(id, { status: "Selesai" })
    showToast(`Status transaksi ${invoice} berhasil diperbarui menjadi Selesai`)
  }

  return (
    <div className="flex flex-col gap-6 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white px-4 py-3 shadow-xl transition-all duration-300 animate-fade-in-up">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <PageHeader
        title={`Halo, ${user?.name || "Kasir"}!`}
        description="Pantau antrean laundry dan kelola order masuk hari ini."
      />

      {/* Quick Buttons Card */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => navigate("/transaksi/baru")}
          size="lg"
          className="flex-1 flex items-center justify-center gap-2.5 h-14 text-base font-semibold shadow-md bg-primary hover:bg-primary/95 text-white"
        >
          <PlusCircle className="h-5 w-5" /> Transaksi Baru
        </Button>
        <Button
          onClick={() => navigate("/pelanggan")}
          size="lg"
          variant="secondary"
          className="flex-1 flex items-center justify-center gap-2.5 h-14 text-base font-semibold border border-border shadow-sm bg-card hover:bg-muted text-foreground"
        >
          <Search className="h-5 w-5 text-muted-foreground" /> Cari Pelanggan
        </Button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Transaksi Hari Ini"
          value={stats.todayTxCount}
          icon={Receipt}
          tone="blue"
          hint="Order baru hari ini"
        />
        <StatCard
          label="Cucian Proses"
          value={stats.cucianProsesCount}
          icon={Loader}
          tone="yellow"
          hint="Sedang dalam proses"
        />
        <StatCard
          label="Selesai Hari Ini"
          value={stats.selesaiTodayCount}
          icon={CheckCircle2}
          tone="green"
          hint="Cucian rampung hari ini"
        />
        <StatCard
          label="Pending Bayar"
          value={stats.pendingBayarCount}
          icon={Clock}
          tone="red"
          hint="Menunggu diproses"
        />
      </div>

      {/* Process Queue Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Antrean Cucian Proses */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader className="h-5 w-5 text-warning animate-spin" /> Antrean Cucian Sedang Proses
            </CardTitle>
            <p className="text-xs text-muted-foreground">List cucian yang sedang dikerjakan</p>
          </CardHeader>
          <CardContent className="flex-1 overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground sticky top-0 bg-card z-10">
                    <th className="pb-3 pr-4 font-medium">Invoice</th>
                    <th className="pb-3 pr-4 font-medium">Pelanggan</th>
                    <th className="pb-3 pr-4 font-medium">Layanan</th>
                    <th className="pb-3 pr-4 font-medium">Berat</th>
                    <th className="pb-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {processQueue.map((t) => (
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="py-2.5 pr-4 font-semibold text-primary">{t.invoice}</td>
                      <td className="py-2.5 pr-4 truncate max-w-[120px]" title={t.customerName}>
                        {t.customerName}
                      </td>
                      <td className="py-2.5 pr-4 text-xs font-medium">{t.serviceName}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground text-xs">
                        {t.weight} {t.unit}
                      </td>
                      <td className="py-2.5 text-right">
                        <Button
                          size="sm"
                          variant="success"
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1"
                          onClick={() => handleMarkAsSelesai(t.id, t.invoice)}
                        >
                          <Check className="h-3 w-3 stroke-[3]" /> Selesai
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {processQueue.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        Tidak ada cucian yang sedang diproses.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Transaksi Hari Ini */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" /> Transaksi Hari Ini
            </CardTitle>
            <p className="text-xs text-muted-foreground">Order laundry masuk hari ini</p>
          </CardHeader>
          <CardContent className="flex-1 overflow-x-auto">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground sticky top-0 bg-card z-10">
                    <th className="pb-3 pr-4 font-medium">Invoice</th>
                    <th className="pb-3 pr-4 font-medium">Pelanggan</th>
                    <th className="pb-3 pr-4 font-medium">Layanan</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {todayTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="py-3 pr-4 font-semibold text-primary">{t.invoice}</td>
                      <td className="py-3 pr-4 truncate max-w-[120px]" title={t.customerName}>
                        {t.customerName}
                      </td>
                      <td className="py-3 pr-4 text-xs">{t.serviceName}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="py-3 text-right font-semibold">{formatCurrency(t.price)}</td>
                    </tr>
                  ))}
                  {todayTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        Belum ada transaksi hari ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
