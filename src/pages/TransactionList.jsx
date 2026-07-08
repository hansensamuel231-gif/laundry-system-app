import { useMemo, useState } from "react"
import { Search, Eye, Pencil, Trash2, Printer, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { useStore } from "../context/StoreContext.jsx"
import { PageHeader } from "../components/ui/PageHeader.jsx"
import { Card } from "../components/ui/Card.jsx"
import { Button } from "../components/ui/Button.jsx"
import { Input, Select, Label } from "../components/ui/Field.jsx"
import { Modal } from "../components/ui/Modal.jsx"
import { StatusBadge } from "../components/ui/StatusBadge.jsx"
import { Nota } from "../components/Nota.jsx"
import { formatCurrency, formatDate } from "../lib/utils.js"

const PER_PAGE = 8
const STATUS_OPTIONS = ["Semua", "Pending", "Proses", "Selesai"]

export default function TransactionList() {
  const { transactions, updateTransaction, deleteTransaction } = useStore()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("Semua")
  const [date, setDate] = useState("")
  const [page, setPage] = useState(1)

  const [viewTx, setViewTx] = useState(null)
  const [editTx, setEditTx] = useState(null)
  const [printTx, setPrintTx] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch =
        !search ||
        t.customerName.toLowerCase().includes(search.toLowerCase()) ||
        t.invoice.toLowerCase().includes(search.toLowerCase())
      const matchStatus = status === "Semua" || t.status === status
      const matchDate = !date || t.date === date
      return matchSearch && matchStatus && matchDate
    })
  }, [transactions, search, status, date])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, totalPages)
  const paged = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  function resetPage(fn) {
    return (v) => {
      fn(v)
      setPage(1)
    }
  }

  function confirmDelete() {
    deleteTransaction(deleteId)
    setDeleteId(null)
  }

  return (
    <div>
      <PageHeader title="Daftar Transaksi" description={`${filtered.length} transaksi ditemukan`} />

      <Card className="mb-4 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Label htmlFor="search">Cari</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                className="pl-9"
                placeholder="Cari invoice atau nama pelanggan..."
                value={search}
                onChange={(e) => resetPage(setSearch)(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="fstatus">Status</Label>
            <Select id="fstatus" value={status} onChange={(e) => resetPage(setStatus)(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="fdate">Tanggal</Label>
            <Input id="fdate" type="date" value={date} onChange={(e) => resetPage(setDate)(e.target.value)} />
          </div>
        </div>
        {(search || status !== "Semua" || date) && (
          <div className="mt-3 flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <button
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => { setSearch(""); setStatus("Semua"); setDate(""); setPage(1) }}
            >
              Reset filter
            </button>
          </div>
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium">Pelanggan</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Layanan</th>
                <th className="px-4 py-3 font-medium">Berat</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Harga</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-primary">{t.invoice}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{t.customerName}</div>
                    <div className="text-xs text-muted-foreground">{t.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(t.date)}</td>
                  <td className="px-4 py-3">{t.serviceName}</td>
                  <td className="px-4 py-3">{t.weight} {t.unit}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(t.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn label="Lihat" onClick={() => setViewTx(t)}><Eye className="h-4 w-4" /></IconBtn>
                      <IconBtn label="Edit" onClick={() => setEditTx(t)}><Pencil className="h-4 w-4" /></IconBtn>
                      <IconBtn label="Cetak" onClick={() => setPrintTx(t)}><Printer className="h-4 w-4" /></IconBtn>
                      <IconBtn label="Hapus" danger onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4" /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border p-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Menampilkan {(current - 1) * PER_PAGE + 1}-{Math.min(current * PER_PAGE, filtered.length)} dari {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={current === 1} onClick={() => setPage(current - 1)}>
                <ChevronLeft className="h-4 w-4" /> Sebelumnya
              </Button>
              <span className="text-sm font-medium">{current} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={current === totalPages} onClick={() => setPage(current + 1)}>
                Berikutnya <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* View modal */}
      <Modal open={!!viewTx} onClose={() => setViewTx(null)} title="Detail Transaksi">
        {viewTx && (
          <div className="flex flex-col gap-3 text-sm">
            <DetailRow label="Invoice" value={viewTx.invoice} />
            <DetailRow label="Pelanggan" value={viewTx.customerName} />
            <DetailRow label="No. HP" value={viewTx.customerPhone} />
            <DetailRow label="Tanggal" value={formatDate(viewTx.date)} />
            <DetailRow label="Layanan" value={viewTx.serviceName} />
            <DetailRow label="Berat/Jumlah" value={`${viewTx.weight} ${viewTx.unit}`} />
            <DetailRow label="Pewangi" value={viewTx.fragrance} />
            <DetailRow label="Status" value={<StatusBadge status={viewTx.status} />} />
            <DetailRow label="Total" value={<span className="font-bold text-primary">{formatCurrency(viewTx.price)}</span>} />
          </div>
        )}
      </Modal>

      {/* Edit modal */}
      <EditModal tx={editTx} onClose={() => setEditTx(null)} onSave={updateTransaction} />

      {/* Print modal */}
      <Modal
        open={!!printTx}
        onClose={() => setPrintTx(null)}
        title="Nota Transaksi"
        footer={
          <>
            <Button variant="outline" onClick={() => setPrintTx(null)}>Tutup</Button>
            <Button onClick={() => window.print()}><Printer className="h-4 w-4" /> Cetak</Button>
          </>
        }
      >
        <Nota tx={printTx} />
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Transaksi"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="danger" onClick={confirmDelete}>Hapus</Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  )
}

function EditModal({ tx, onClose, onSave }) {
  return (
    <Modal open={!!tx} onClose={onClose} title={`Edit ${tx?.invoice || ""}`}>
      {tx && <EditForm key={tx.id} tx={tx} onClose={onClose} onSave={onSave} />}
    </Modal>
  )
}

function EditForm({ tx, onClose, onSave }) {
  const [status, setStatus] = useState(tx.status)
  const [weight, setWeight] = useState(String(tx.weight))

  const unitPrice = tx.price / tx.weight
  const newPrice = Math.round(unitPrice * Number(weight || 0))

  function handleSave() {
    onSave(tx.id, { status, weight: Number(weight), price: newPrice })
    onClose()
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="ename">Pelanggan</Label>
        <Input id="ename" value={tx.customerName} disabled />
      </div>
      <div>
        <Label htmlFor="eweight">Berat / Jumlah ({tx.unit})</Label>
        <Input id="eweight" type="number" min="0" step="0.5" value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="estatus">Status</Label>
        <Select id="estatus" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Proses">Proses</option>
          <option value="Selesai">Selesai</option>
        </Select>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
        <span className="text-muted-foreground">Total baru</span>
        <span className="font-semibold text-primary">{formatCurrency(newPrice)}</span>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>Batal</Button>
        <Button onClick={handleSave}>Simpan</Button>
      </div>
    </div>
  )
}

function IconBtn({ children, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={
        "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors " +
        (danger
          ? "text-danger hover:bg-danger-muted"
          : "text-muted-foreground hover:bg-muted hover:text-foreground")
      }
    >
      {children}
    </button>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
