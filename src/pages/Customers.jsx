import { useMemo, useState } from "react"
import { Search, Plus, Pencil, Trash2, History, Phone, MapPin } from "lucide-react"
import { useStore } from "../context/StoreContext.jsx"
import { PageHeader } from "../components/ui/PageHeader.jsx"
import { Card } from "../components/ui/Card.jsx"
import { Button } from "../components/ui/Button.jsx"
import { Input, Label, Textarea } from "../components/ui/Field.jsx"
import { Modal } from "../components/ui/Modal.jsx"
import { StatusBadge } from "../components/ui/StatusBadge.jsx"
import { formatCurrency, formatDate } from "../lib/utils.js"

export default function Customers() {
  const { customers, transactions, addCustomer, updateCustomer, deleteCustomer } = useStore()
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [historyOf, setHistoryOf] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const filtered = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search),
    )
  }, [customers, search])

  const historyTx = historyOf
    ? transactions.filter((t) => t.customerId === historyOf.id || t.customerName === historyOf.name)
    : []

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }
  function openEdit(c) {
    setEditing(c)
    setFormOpen(true)
  }

  return (
    <div>
      <PageHeader title="Data Pelanggan" description={`${customers.length} pelanggan terdaftar`}>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Tambah Pelanggan
        </Button>
      </PageHeader>

      <Card className="mb-4 p-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Cari nama atau nomor HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">No. HP</th>
                <th className="px-4 py-3 font-medium">Alamat</th>
                <th className="px-4 py-3 font-medium">Bergabung</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{c.address}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn label="Riwayat" onClick={() => setHistoryOf(c)}><History className="h-4 w-4" /></IconBtn>
                      <IconBtn label="Edit" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></IconBtn>
                      <IconBtn label="Hapus" danger onClick={() => setDeleteId(c.id)}><Trash2 className="h-4 w-4" /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    Tidak ada pelanggan yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit Pelanggan" : "Tambah Pelanggan"}>
        <CustomerForm
          key={editing?.id || "new"}
          initial={editing}
          onCancel={() => setFormOpen(false)}
          onSubmit={(data) => {
            if (editing) updateCustomer(editing.id, data)
            else addCustomer(data)
            setFormOpen(false)
          }}
        />
      </Modal>

      {/* History modal */}
      <Modal open={!!historyOf} onClose={() => setHistoryOf(null)} title="Riwayat Transaksi" size="lg">
        {historyOf && (
          <div>
            <div className="mb-4 rounded-lg bg-muted p-3">
              <p className="font-semibold">{historyOf.name}</p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {historyOf.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {historyOf.address}</span>
              </div>
            </div>
            {historyTx.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Belum ada transaksi.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">Invoice</th>
                      <th className="pb-2 pr-3 font-medium">Tanggal</th>
                      <th className="pb-2 pr-3 font-medium">Layanan</th>
                      <th className="pb-2 pr-3 font-medium">Status</th>
                      <th className="pb-2 text-right font-medium">Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyTx.map((t) => (
                      <tr key={t.id} className="border-b border-border last:border-0">
                        <td className="py-2 pr-3 font-medium text-primary">{t.invoice}</td>
                        <td className="py-2 pr-3 text-muted-foreground">{formatDate(t.date)}</td>
                        <td className="py-2 pr-3">{t.serviceName}</td>
                        <td className="py-2 pr-3"><StatusBadge status={t.status} /></td>
                        <td className="py-2 text-right font-medium">{formatCurrency(t.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Pelanggan"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="danger" onClick={() => { deleteCustomer(deleteId); setDeleteId(null) }}>Hapus</Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">Yakin ingin menghapus data pelanggan ini?</p>
      </Modal>
    </div>
  )
}

function CustomerForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "")
  const [phone, setPhone] = useState(initial?.phone || "")
  const [address, setAddress] = useState(initial?.address || "")

  function submit(e) {
    e.preventDefault()
    onSubmit({ name, phone, address })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name">Nama</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required />
      </div>
      <div>
        <Label htmlFor="phone">No. HP</Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" required />
      </div>
      <div>
        <Label htmlFor="address">Alamat</Label>
        <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat lengkap" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        <Button type="submit">Simpan</Button>
      </div>
    </form>
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
        (danger ? "text-danger hover:bg-danger-muted" : "text-muted-foreground hover:bg-muted hover:text-foreground")
      }
    >
      {children}
    </button>
  )
}
