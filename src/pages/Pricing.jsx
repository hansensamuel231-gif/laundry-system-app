import { useState } from "react"
import { Pencil, Check, X, Tags } from "lucide-react"
import { useStore } from "../context/StoreContext.jsx"
import { PageHeader } from "../components/ui/PageHeader.jsx"
import { Card } from "../components/ui/Card.jsx"
import { Button } from "../components/ui/Button.jsx"
import { Input } from "../components/ui/Field.jsx"
import { formatCurrency } from "../lib/utils.js"

export default function Pricing() {
  const { services, updateService } = useStore()
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")
  const [saved, setSaved] = useState(false)

  function startEdit(s) {
    setEditingId(s.id)
    setDraft(String(s.price))
    setSaved(false)
  }
  function save(id) {
    updateService(id, { price: Number(draft) })
    setEditingId(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <PageHeader title="Pengaturan Harga" description="Kelola daftar layanan dan tarif per satuan." />

      {saved && (
        <div className="mb-4 rounded-lg bg-success-muted px-4 py-2.5 text-sm font-medium text-success-muted-foreground">
          Perubahan harga berhasil disimpan.
        </div>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Layanan</th>
                <th className="px-4 py-3 font-medium">Satuan</th>
                <th className="px-4 py-3 font-medium">Harga</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => {
                const isEditing = editingId === s.id
                return (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                          <Tags className="h-4 w-4" />
                        </span>
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">per {s.unit}</td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Rp</span>
                          <Input
                            type="number"
                            min="0"
                            step="500"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="h-9 w-32"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <span className="font-semibold">{formatCurrency(s.price)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {isEditing ? (
                          <>
                            <Button size="sm" variant="success" onClick={() => save(s.id)}>
                              <Check className="h-4 w-4" /> Simpan
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEdit(s)}>
                            <Pencil className="h-4 w-4" /> Edit
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
