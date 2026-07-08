import { useMemo, useState } from "react"
import { TrendingUp, TrendingDown, Wallet, FileText, FileSpreadsheet, ShieldAlert, Check } from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import { useStore } from "../context/StoreContext.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { PageHeader } from "../components/ui/PageHeader.jsx"
import { StatCard } from "../components/ui/StatCard.jsx"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx"
import { Button } from "../components/ui/Button.jsx"
import { Label, Select } from "../components/ui/Field.jsx"
import { formatCurrency, formatDate } from "../lib/utils.js"

export default function Reports() {
  const { transactions } = useStore()
  const { user } = useAuth()
  
  // Toast state
  const [toast, setToast] = useState(null)
  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  // State for Month and Year filter
  const [selectedMonth, setSelectedMonth] = useState(() => String(new Date().getMonth() + 1).padStart(2, "0"))
  const [selectedYear, setSelectedYear] = useState(() => String(new Date().getFullYear()))

  // 1. Role verification
  if (user?.role !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border shadow-md p-8 text-center max-w-md mx-auto mt-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-muted text-danger-muted-foreground mb-4">
          <ShieldAlert className="h-8 w-8 text-danger" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Akses Ditolak</h1>
        <p className="mt-2 text-sm text-muted-foreground font-medium">Akses Ditolak - Halaman ini hanya untuk Admin</p>
      </div>
    )
  }

  // 2. Filter transactions based on selected Month and Year
  const currentPrefix = `${selectedYear}-${selectedMonth}`
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => t.date.startsWith(currentPrefix))
  }, [transactions, currentPrefix])

  // 3. Calculate statistics for the selected month
  const stats = useMemo(() => {
    const totalPemasukan = filteredTransactions.reduce((sum, t) => sum + t.price, 0)
    // Mock expenses at 30% of revenue + a small base, or 0 if no revenue
    const totalPengeluaran = totalPemasukan > 0 ? Math.round(totalPemasukan * 0.3) + 180000 : 0
    const labaBersih = totalPemasukan - totalPengeluaran

    return {
      pemasukan: totalPemasukan,
      pengeluaran: totalPengeluaran,
      laba: labaBersih,
    }
  }, [filteredTransactions])

  // 4. Generate dynamic 6-month chart data ending on selected month/year
  const chartData = useMemo(() => {
    const data = []
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]
    const yearNum = parseInt(selectedYear)
    const monthIdx = parseInt(selectedMonth) - 1 // 0-11

    for (let i = 5; i >= 0; i--) {
      // Get dates in the past
      const targetDate = new Date(yearNum, monthIdx - i, 1)
      const y = targetDate.getFullYear()
      const m = String(targetDate.getMonth() + 1).padStart(2, "0")
      const prefix = `${y}-${m}`

      const monthlyTx = transactions.filter((t) => t.date.startsWith(prefix))
      const monthlyPemasukan = monthlyTx.reduce((sum, t) => sum + t.price, 0)

      data.push({
        name: `${monthNames[targetDate.getMonth()]} ${y}`,
        pemasukan: monthlyPemasukan,
      })
    }
    return data
  }, [transactions, selectedMonth, selectedYear])

  const handleExport = (type) => {
    showToast(`Laporan Keuangan berhasil diexport ke ${type}!`)
  }

  const months = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ]

  const years = ["2025", "2026", "2027"]

  return (
    <div className="flex flex-col gap-6 relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white px-4 py-3 shadow-xl transition-all duration-300">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <PageHeader title="Laporan Keuangan" description="Analisis pemasukan, pengeluaran, dan profitabilitas Zahra Laundry.">
        <Button variant="outline" onClick={() => handleExport("PDF")}>
          <FileText className="h-4 w-4 text-rose-500" /> Export PDF
        </Button>
        <Button variant="outline" onClick={() => handleExport("Excel")}>
          <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Export Excel
        </Button>
      </PageHeader>

      {/* Period Filter Card */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1 max-w-xs">
            <Label htmlFor="fmonth">Bulan</Label>
            <Select id="fmonth" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </Select>
          </div>
          <div className="flex-1 max-w-xs">
            <Label htmlFor="fyear">Tahun</Label>
            <Select id="fyear" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* 3 Large Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Pemasukan Bulan Ini"
          value={formatCurrency(stats.pemasukan)}
          icon={TrendingUp}
          tone="green"
          hint="Penerimaan cucian masuk"
        />
        <StatCard
          label="Pengeluaran"
          value={formatCurrency(stats.pengeluaran)}
          icon={TrendingDown}
          tone="red"
          hint="Biaya operasional & detergen"
        />
        <StatCard
          label="Laba Bersih"
          value={formatCurrency(stats.laba)}
          icon={Wallet}
          tone="blue"
          hint="Pemasukan - Pengeluaran"
        />
      </div>

      {/* 6-Month Income Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" /> Tren Pemasukan 6 Bulan Terakhir
          </CardTitle>
          <p className="text-xs text-muted-foreground">Grafik batang pendapatan periodik laundry</p>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => (v >= 1000000 ? `${v / 1000000}jt` : `${v / 1000}k`)}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 13 }}
                  formatter={(v) => [formatCurrency(v), "Pemasukan"]}
                />
                <Bar dataKey="pemasukan" fill="var(--color-success)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Details Table */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Rincian Transaksi Periode</CardTitle>
          <p className="text-xs text-muted-foreground">Detail invoice laundry untuk periode terpilih</p>
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
                  <th className="pb-3 pr-4 font-medium">Berat/Jumlah</th>
                  <th className="pb-3 text-right font-medium">Total Harga</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="py-3 pr-4 font-semibold text-primary">{t.invoice}</td>
                    <td className="py-3 pr-4 font-medium">{t.customerName}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{formatDate(t.date)}</td>
                    <td className="py-3 pr-4 text-xs font-semibold">{t.serviceName}</td>
                    <td className="py-3 pr-4 text-muted-foreground text-xs">
                      {t.weight} {t.unit}
                    </td>
                    <td className="py-3 text-right font-semibold">{formatCurrency(t.price)}</td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      Tidak ada transaksi pada periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredTransactions.length > 0 && (
                <tfoot>
                  <tr className="font-bold text-foreground bg-muted/20">
                    <td colSpan={5} className="py-4 pl-4 text-left border-t border-border">Total Pemasukan</td>
                    <td className="py-4 pr-4 text-right text-primary font-bold border-t border-border text-base">
                      {formatCurrency(stats.pemasukan)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
