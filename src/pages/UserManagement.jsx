import { useState } from "react"
import { Plus, Pencil, Trash2, ShieldAlert, Check } from "lucide-react"
import { useStore } from "../context/StoreContext.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { PageHeader } from "../components/ui/PageHeader.jsx"
import { Card } from "../components/ui/Card.jsx"
import { Button } from "../components/ui/Button.jsx"
import { Input, Label, Select } from "../components/ui/Field.jsx"
import { Modal } from "../components/ui/Modal.jsx"

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useStore()
  const { user } = useAuth()
  
  // Dialog state
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

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

  const handleOpenAdd = () => {
    setEditingUser(null)
    setFormOpen(true)
  }

  const handleOpenEdit = (u) => {
    setEditingUser(u)
    setFormOpen(true)
  }

  const handleToggleStatus = (u) => {
    const nextStatus = u.status === "Aktif" ? "Nonaktif" : "Aktif"
    updateUser(u.id, { status: nextStatus })
    showToast(`Status ${u.username} berhasil diubah menjadi ${nextStatus}`)
  }

  const handleDelete = () => {
    deleteUser(deleteId)
    setDeleteId(null)
    showToast("User berhasil dihapus")
  }

  const handleFormSubmit = (data) => {
    if (editingUser) {
      updateUser(editingUser.id, data)
      showToast("User berhasil diperbarui")
    } else {
      addUser(data)
      showToast("User berhasil ditambahkan")
    }
    setFormOpen(false)
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

      <PageHeader title="Manajemen User" description={`Mengelola ${users.length} pengguna sistem`}>
        <Button onClick={handleOpenAdd} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Tambah Pengguna
        </Button>
      </PageHeader>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Nama Lengkap</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  {/* Username */}
                  <td className="px-4 py-3 font-mono font-semibold text-muted-foreground">{u.username}</td>
                  
                  {/* Nama Lengkap */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {u.name.charAt(0)}
                      </span>
                      <span className="font-semibold text-foreground">{u.name}</span>
                    </div>
                  </td>
                  
                  {/* Role Badge */}
                  <td className="px-4 py-3">
                    <RoleBadge role={u.role} />
                  </td>
                  
                  {/* Status Toggle Switch */}
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          u.status === "Aktif" ? "bg-primary" : "bg-muted"
                        }`}
                        aria-label="Toggle user status"
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            u.status === "Aktif" ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                      <span className={`ml-2 text-xs font-semibold ${u.status === "Aktif" ? "text-emerald-600" : "text-rose-500"}`}>
                        {u.status}
                      </span>
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <IconBtn label="Edit" onClick={() => handleOpenEdit(u)}>
                        <Pencil className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn label="Hapus" danger onClick={() => setDeleteId(u.id)}>
                        <Trash2 className="h-4 w-4" />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Form Modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editingUser ? "Edit Pengguna" : "Tambah Pengguna"}>
        <UserForm
          key={editingUser?.id || "new"}
          initial={editingUser}
          onCancel={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus User"
        size="sm"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="danger" onClick={handleDelete}>Hapus</Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground font-semibold">Yakin hapus user ini?</p>
      </Modal>
    </div>
  )
}

function RoleBadge({ role }) {
  const isAdmin = role === "Admin"
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
        isAdmin
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {role}
    </span>
  )
}

function UserForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial?.name || "")
  const [username, setUsername] = useState(initial?.username || "")
  const [password, setPassword] = useState(initial?.password || "")
  const [role, setRole] = useState(initial?.role || "Kasir")
  const [status, setStatus] = useState(initial?.status || "Aktif")

  function submit(e) {
    e.preventDefault()
    onSubmit({ name, username, password, role, status })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="uname">Nama Lengkap</Label>
        <Input id="uname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required />
      </div>
      <div>
        <Label htmlFor="uuser">Username</Label>
        <Input id="uuser" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" required />
      </div>
      <div>
        <Label htmlFor="upass">Password</Label>
        <Input id="upass" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" required />
      </div>
      
      <div>
        <Label htmlFor="urole">Role</Label>
        <Select id="urole" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Admin">Admin</option>
          <option value="Kasir">Kasir</option>
        </Select>
      </div>

      {/* Toggle Status in Form */}
      <div className="flex items-center justify-between py-2 border-b border-border">
        <div>
          <span className="text-sm font-semibold text-foreground">Status Aktif</span>
          <p className="text-xs text-muted-foreground">Berikan akses masuk ke sistem</p>
        </div>
        <button
          type="button"
          onClick={() => setStatus(status === "Aktif" ? "Nonaktif" : "Aktif")}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            status === "Aktif" ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              status === "Aktif" ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="flex justify-end gap-2 mt-2">
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
