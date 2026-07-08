import { useMemo, useState } from "react"
import { Save, Printer, User, ShoppingBag, CheckCircle2 } from "lucide-react"
import { useStore } from "../context/StoreContext.jsx"
import { PageHeader } from "../components/ui/PageHeader.jsx"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card.jsx"
import { Button } from "../components/ui/Button.jsx"
import { Input, Label, Select, Textarea } from "../components/ui/Field.jsx"
import { Modal } from "../components/ui/Modal.jsx"
import { Nota } from "../components/Nota.jsx"
import { fragrances } from "../lib/data.js"
import { formatCurrency, todayISO } from "../lib/utils.js"

const emptyForm = {
  customerName: "",
  customerPhone: "",
  address: "",
  serviceId: "",
  weight: "",
  fragrance: fragrances[0],
  date: todayISO(),
  note: "",
}

export default function NewTransaction() {
  const { services, addTransaction } = useStore()
  const [form, setForm] = useState(emptyForm)
  const [savedTx, setSavedTx] = useState(null)
  const [showNota, setShowNota] = useState(false)

  const selectedService = services.find((s) => s.id === Number(form.serviceId))
  const total = useMemo(() => {
    if (!selectedService || !form.weight) return 0
    return selectedService.price * Number(form.weight)
  }, [selectedService, form.weight])

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function buildTx() {
    return {
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerId: null,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      unit: selectedService.unit,
      weight: Number(form.weight),
      fragrance: form.fragrance,
      note: form.note,
      date: form.date,
      status: "Pending",
      price: total,
    }
  }

  function handleSubmit(e, print = false) {
    e.preventDefault()
    if (!selectedService || !form.weight) return
    const tx = addTransaction(buildTx())
    setSavedTx(tx)
    if (print) {
      setShowNota(true)
    }
    setForm(emptyForm)
  }

  return (
    <div>
      <PageHeader title="Transaksi Baru" description="Buat order laundry baru untuk pelanggan." />

      {savedTx && !showNota && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-success-muted bg-success-muted p-4 text-success-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">
              Transaksi {savedTx.invoice} berhasil disimpan!
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowNota(true)}>
            <Printer className="h-4 w-4" /> Cetak Nota
          </Button>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Data Pelanggan
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label htmlFor="cname">Nama Pelanggan</Label>
                  <Input id="cname" value={form.customerName} onChange={(e) => set("customerName", e.target.value)} placeholder="Nama lengkap" required />
                </div>
                <div className="sm:col-span-1">
                  <Label htmlFor="cphone">No. HP</Label>
                  <Input id="cphone" value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} placeholder="08xxxxxxxxxx" required />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="caddr">Alamat</Label>
                  <Textarea id="caddr" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Alamat pelanggan" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-primary" /> Detail Order
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="service">Jenis Layanan</Label>
                  <Select id="service" value={form.serviceId} onChange={(e) => set("serviceId", e.target.value)} required>
                    <option value="">Pilih layanan</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} - {formatCurrency(s.price)}/{s.unit}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weight">Berat / Jumlah {selectedService ? `(${selectedService.unit})` : ""}</Label>
                  <Input id="weight" type="number" min="0" step="0.5" value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="0" required />
                </div>
                <div>
                  <Label htmlFor="fragrance">Pewangi</Label>
                  <Select id="fragrance" value={form.fragrance} onChange={(e) => set("fragrance", e.target.value)}>
                    {fragrances.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Tanggal</Label>
                  <Input id="date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="note">Catatan</Label>
                  <Textarea id="note" value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Catatan tambahan (opsional)" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle>Ringkasan Biaya</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <Row label="Layanan" value={selectedService?.name || "-"} />
                <Row label="Harga satuan" value={selectedService ? `${formatCurrency(selectedService.price)}/${selectedService.unit}` : "-"} />
                <Row label="Berat / Jumlah" value={form.weight ? `${form.weight} ${selectedService?.unit || ""}` : "-"} />
                <Row label="Pewangi" value={form.fragrance} />
                <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  <Button type="submit" className="w-full">
                    <Save className="h-4 w-4" /> Simpan
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={(e) => handleSubmit(e, true)}>
                    <Printer className="h-4 w-4" /> Simpan & Cetak Nota
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      <Modal
        open={showNota}
        onClose={() => setShowNota(false)}
        title="Nota Transaksi"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowNota(false)}>Tutup</Button>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Cetak
            </Button>
          </>
        }
      >
        <Nota tx={savedTx} />
      </Modal>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
