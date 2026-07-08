import { useState } from "react"
import { Pencil, Tags, ShieldAlert, Check, Clock } from "lucide-react"
import { useStore } from "../context/StoreContext.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { PageHeader } from "../components/ui/PageHeader.jsx"
import { Card } from "../components/ui/Card.jsx"
import { Button } from "../components/ui/Button.jsx"
import { Input, Label } from "../components/ui/Field.jsx"
import { Modal } from "../components/ui/Modal.jsx"
import { formatCurrency } from "../lib/utils.js"

export default function Pricing() {
  const { services, updateService } = useStore()
  const { user } = useAuth()

  // State for pricing modal and draft fields
  const [editingService, setEditingService] = useState(null)
  const [priceDraft, setPriceDraft] = useState("")
  const [minPriceDraft, setMinPriceDraft] = useState("")
  const [durationDraft, setDurationDraft] = useState("")

  // Toast state
  const [toast, setToast] = useState(null)
  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  // 1. Role verification
  if (user?.role !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border shadow-md p-8 text-center max-w-md mx-auto mt-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-muted text-danger-muted-foreground mb-4">
          <ShieldAlert className="h-8 w-8 text-danger" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Akses Ditolak</h1>
      </div>
    )
  }

  const handleEditClick = (s) => {
    setEditingService(s)
    setPriceDraft(String(s.price))
    setMinPriceDraft(String(s.minPrice || ""))
    setDurationDraft(s.duration || "")
  }

  const handleSave = () => {
    if (!editingService) return
    updateService(editingService.id, {
      price: Number(priceDraft),
      minPrice: Number(minPriceDraft),
      duration: durationDraft,
    })
    setEditingService(null)
    showToast("Harga berhasil diperbarui")
  }

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

      <PageHeader title="Pengaturan Harga" description="Kelola daftar harga per kg, batas minimum order, dan durasi cuci." />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Jenis Layanan</th>
                <th className="px-4 py-3 font-medium">Harga per Kg</th>
                <th className="px-4 py-3 font-medium">Harga Minimum</th>
                <th className="px-4 py-3 font-medium">Durasi</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Tags className="h-4 w-4" />
                      </span>
                      <span className="font-semibold">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary">
                    {formatCurrency(s.price)} / {s.unit}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-medium">
                    {s.minPrice ? formatCurrency(s.minPrice) : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      <Clock className="h-3 w-3" /> {s.duration || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(s)} className="inline-flex items-center gap-1">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Pricing Modal */}
      <Modal
        open={!!editingService}
        onClose={() => setEditingService(null)}
        title={`Edit Harga - ${editingService?.name}`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingService(null)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </div>
        }
      >
        {editingService && (
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="eprice">Harga per {editingService.unit}</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">Rp</span>
                <Input
                  id="eprice"
                  type="number"
                  className="pl-9"
                  value={priceDraft}
                  onChange={(e) => setPriceDraft(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="eminprice">Harga Minimum (Batas Minimum Order)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">Rp</span>
                <Input
                  id="eminprice"
                  type="number"
                  className="pl-9"
                  value={minPriceDraft}
                  onChange={(e) => setMinPriceDraft(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="eduration">Durasi Layanan</Label>
              <Input
                id="eduration"
                type="text"
                value={durationDraft}
                onChange={(e) => setDurationDraft(e.target.value)}
                placeholder="Contoh: 2 hari, 6 jam"
                required
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
