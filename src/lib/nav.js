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
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/transaksi/baru", label: "Transaksi Baru", icon: PlusCircle },
  { to: "/transaksi", label: "Daftar Transaksi", icon: ListChecks },
  { to: "/pelanggan", label: "Data Pelanggan", icon: Users },
  { to: "/laporan", label: "Laporan Keuangan", icon: Wallet, adminOnly: true },
  { to: "/pengaturan/harga", label: "Pengaturan Harga", icon: Tags, adminOnly: true },
  { to: "/pengaturan/user", label: "Manajemen User", icon: UserCog, adminOnly: true },
]
