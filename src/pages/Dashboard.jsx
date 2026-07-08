import { useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Receipt,
  Loader,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react"
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
import { StatusBadge } from "../components/ui/StatusBadge.jsx"
import { weeklyRevenue } from "../lib/data.js"
import { formatCurrency, formatDate } from "../lib/utils.js"

export default function Dashboard() {
  const { transactions } = useStore()
  const { user } = useAuth()

  const stats = useMemo(() => {
    return {
      total: transactions.length,
      proses: transactions.filter((t) => t.status === "Proses").length,
      selesai: transactions.filter((t) => t.status === "Selesai").length,
      pending: transactions.filter((t) => t.status === "Pending").length,
    }
  }, [transactions])

  const recent = transactions.slice(0, 5)

  return (
    <div>
      <PageHeader
        title={`Halo, ${user?.name?.split(" ")[0] || "Pengguna"}!`}
        description="Ringkasan aktivitas laundry hari ini."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Transaksi" value={stats.total} icon={Receipt} tone="blue" hint="Keseluruhan order" />
        <StatCard label="Cucian Proses" value={stats.proses} icon={Loader} tone="yellow" hint="Sedang dikerjakan" />
        <StatCard label="Selesai" value={stats.selesai} icon={CheckCircle2} tone="green" hint="Siap diambil" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} tone="red" hint="Menunggu diproses" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Omset Mingguan</CardTitle>
            <p className="text-sm text-muted-foreground">Pendapatan 7 hari terakhir</p>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyRevenue} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v / 1000000}jt`}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-muted)" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      fontSize: 13,
                    }}
                    formatter={(v) => [formatCurrency(v), "Omset"]}
                  />
                  <Bar dataKey="omset" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Status</CardTitle>
            <p className="text-sm text-muted-foreground">Distribusi order saat ini</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <StatusRow label="Pending" value={stats.pending} total={stats.total} color="var(--color-danger)" />
            <StatusRow label="Proses" value={stats.proses} total={stats.total} color="var(--color-warning)" />
            <StatusRow label="Selesai" value={stats.selesai} total={stats.total} color="var(--color-success)" />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <p className="text-sm text-muted-foreground">5 order terakhir</p>
          </div>
          <Link
            to="/transaksi"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Lihat semua <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Invoice</th>
                  <th className="pb-3 pr-4 font-medium">Pelanggan</th>
                  <th className="pb-3 pr-4 font-medium">Tanggal</th>
                  <th className="pb-3 pr-4 font-medium">Layanan</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-0 text-right font-medium">Harga</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-primary">{t.invoice}</td>
                    <td className="py-3 pr-4">{t.customerName}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{formatDate(t.date)}</td>
                    <td className="py-3 pr-4">{t.serviceName}</td>
                    <td className="py-3 pr-4"><StatusBadge status={t.status} /></td>
                    <td className="py-3 pr-0 text-right font-medium">{formatCurrency(t.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatusRow({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value} ({pct}%)</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
