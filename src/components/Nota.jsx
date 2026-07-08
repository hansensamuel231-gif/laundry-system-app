import { Shirt } from "lucide-react"
import { formatCurrency, formatDate } from "../lib/utils.js"

// Komponen nota untuk dicetak
export function Nota({ tx }) {
  if (!tx) return null
  return (
    <div className="print-area mx-auto max-w-sm rounded-xl border border-border bg-card p-6 text-sm">
      <div className="mb-4 flex flex-col items-center border-b border-dashed border-border pb-4 text-center">
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Shirt className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold">LaundryPro</h2>
        <p className="text-xs text-muted-foreground">Jl. Bersih No. 123, Jakarta</p>
        <p className="text-xs text-muted-foreground">Telp: 021-1234567</p>
      </div>

      <div className="mb-3 flex justify-between">
        <span className="text-muted-foreground">Invoice</span>
        <span className="font-semibold">{tx.invoice}</span>
      </div>
      <div className="mb-3 flex justify-between">
        <span className="text-muted-foreground">Tanggal</span>
        <span>{formatDate(tx.date)}</span>
      </div>

      <div className="mb-3 border-t border-dashed border-border pt-3">
        <p className="font-medium">{tx.customerName}</p>
        <p className="text-xs text-muted-foreground">{tx.customerPhone}</p>
      </div>

      <div className="border-t border-dashed border-border pt-3">
        <div className="flex justify-between">
          <span>{tx.serviceName}</span>
          <span>{tx.weight} {tx.unit}</span>
        </div>
        {tx.fragrance && tx.fragrance !== "Tanpa Pewangi" && (
          <p className="text-xs text-muted-foreground">Pewangi: {tx.fragrance}</p>
        )}
        {tx.note && <p className="text-xs text-muted-foreground">Catatan: {tx.note}</p>}
      </div>

      <div className="mt-3 flex justify-between border-t border-dashed border-border pt-3 text-base font-bold">
        <span>Total</span>
        <span>{formatCurrency(tx.price)}</span>
      </div>

      <p className="mt-4 border-t border-dashed border-border pt-3 text-center text-xs text-muted-foreground">
        Terima kasih atas kepercayaan Anda!
      </p>
    </div>
  )
}
