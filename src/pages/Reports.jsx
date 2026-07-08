import { useMemo, useState } from "react"
import { TrendingUp, TrendingDown, Wallet, FileText, FileSpreadsheet } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { PageHeader } from "../components/ui/PageHeader.jsx"
import { StatCard } from "../components/ui/StatCard.jsx"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx"
import { Button } from "../components/ui/Button.jsx"
import { Input, Label } from "../components/ui/Field.jsx"
import { monthlyFinance } from "../lib/data.js"
import { formatCurrency } from "../lib/utils.js"

export default function Reports() {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const totals = useMemo(() => {
    const pemasukan = monthlyFinance.reduce((s, m) => s + m.pemasukan, 0)
    const pengeluaran = monthlyFinance.reduce((s, m) => s + m.pengeluaran, 0)
    return { pemasukan, pengeluaran, laba: pemasukan - pengeluaran }
  }, [])

  return (
    <div>
      <PageHeader title="Laporan Keuangan" description="Analisa pemasukan, pengeluaran, dan laba.">
        <Button variant="outline" onClick={() => alert("Export PDF (dummy) — fitur akan tersedia setelah integrasi backend.")}>
          <FileText className="h-4 w-4" /> Export PDF
        </Button>
        <Button variant="outline" onClick={() => alert("Export Excel (dummy) — fitur akan tersedia setelah integrasi backend.")}>
          <FileSpreadsheet className="h-4 w-4" /> Export Excel
        </Button>
      </PageHeader>

      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div>
            <Label htmlFor="from">Dari Tanggal</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="to">Sampai Tanggal</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <Button variant="secondary" onClick={() => {}}>Terapkan Filter</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Pemasukan" value={formatCurrency(totals.pemasukan)} icon={TrendingUp} tone="green" hint="Periode berjalan" />
        <StatCard label="Total Pengeluaran" value={formatCurrency(totals.pengeluaran)} icon={TrendingDown} tone="red" hint="Periode berjalan" />
        <StatCard label="Laba Bersih" value={formatCurrency(totals.laba)} icon={Wallet} tone="blue" hint="Pemasukan - Pengeluaran" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tren Keuangan Bulanan</CardTitle>
          <p className="text-sm text-muted-foreground">Perbandingan pemasukan dan pengeluaran</p>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyFinance} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v / 1000000}jt`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 13 }}
                  formatter={(v, name) => [formatCurrency(v), name === "pemasukan" ? "Pemasukan" : "Pengeluaran"]}
                />
                <Legend
                  formatter={(v) => (v === "pemasukan" ? "Pemasukan" : "Pengeluaran")}
                  wrapperStyle={{ fontSize: 13 }}
                />
                <Line type="monotone" dataKey="pemasukan" stroke="var(--color-success)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="pengeluaran" stroke="var(--color-danger)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 overflow-hidden">
        <CardHeader>
          <CardTitle>Rincian Bulanan</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">Bulan</th>
                  <th className="pb-3 pr-4 text-right font-medium">Pemasukan</th>
                  <th className="pb-3 pr-4 text-right font-medium">Pengeluaran</th>
                  <th className="pb-3 text-right font-medium">Laba</th>
                </tr>
              </thead>
              <tbody>
                {monthlyFinance.map((m) => (
                  <tr key={m.month} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium">{m.month}</td>
                    <td className="py-3 pr-4 text-right text-success-muted-foreground">{formatCurrency(m.pemasukan)}</td>
                    <td className="py-3 pr-4 text-right text-danger-muted-foreground">{formatCurrency(m.pengeluaran)}</td>
                    <td className="py-3 text-right font-semibold">{formatCurrency(m.pemasukan - m.pengeluaran)}</td>
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
