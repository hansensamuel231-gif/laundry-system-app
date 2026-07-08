import { useState } from "react"
import { Plus, Pencil, Trash2, UserCog } from "lucide-react"
import { useStore } from "../context/StoreContext.jsx"
import { PageHeader } from "../components/ui/PageHeader.jsx"
import { Card } from "../components/ui/Card.jsx"
import { Button } from "../components/ui/Button.jsx"
import { Input, Label, Select } from "../components/ui/Field.jsx"
import { Modal } from "../components/ui/Modal.jsx"
import { RoleBadge, ActiveBadge } from "../components/ui/StatusBadge.jsx"

export default function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }
  function openEdit(u) {
    setEditing(u)
    setFormOpen(true)
  }

  return (
    <div>
      <PageHeader title="Manajemen User" description={`${users.length} pengguna sistem`}>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" /> Tambah User
        </Button>
      </PageHeader>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                        {u.name.charAt(0)}
                      </span>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{u.username}</td>
                  <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3"><ActiveBadge status={u.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <IconBtn label="Edit" onClick={() => openEdit(u)}><Pencil className="h-4 w-4" /></IconBtn>
                      <IconBtn label="Hapus" danger onClick={() => setDeleteId(u.id)}><Trash2 className="h-4 w-4" /></IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Edit User" : "Tambah User"}>
        <UserForm
          key={editing?.id || "new"}
          initial={editing}
          onCancel={() => setFormOpen(false)}
          onSubmit={(data) => {
            if (editing) updateUser(editing.id, data)
            else addUser(data)
            setFormOpen(false)
          }}
        />
      </Modal>

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus User"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
            <Button variant="danger" onClick={() => { deleteUser(deleteId); setDeleteId(null) }}>Hapus</Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">Yakin ingin menghapus pengguna ini?</p>
      </Modal>
    </div>
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="urole">Role</Label>
          <Select id="urole" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="Kasir">Kasir</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="ustatus">Status</Label>
          <Select id="ustatus" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </Select>
        </div>
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
