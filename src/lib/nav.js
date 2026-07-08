import {
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  Users,
  Wallet,
  Tags,
  UserCog,
} from "lucide-react"

// adminOnly: true berarti menu hanya untuk role Admin
export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/transaksi/baru", label: "Transaksi Baru", icon: PlusCircle },
  { to: "/transaksi", label: "Daftar Transaksi", icon: ListChecks },
  { to: "/pelanggan", label: "Data Pelanggan", icon: Users },
  { to: "/laporan", label: "Laporan Keuangan", icon: Wallet, adminOnly: true },
  { to: "/harga", label: "Pengaturan Harga", icon: Tags, adminOnly: true },
  { to: "/user", label: "Manajemen User", icon: UserCog, adminOnly: true },
]
