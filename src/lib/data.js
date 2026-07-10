export const initialServices = [
  { id: 1, name: "Cuci Kering", unit: "kg", price: 5000, minPrice: 15000, duration: "2 hari" },
  { id: 2, name: "Cuci Setrika", unit: "kg", price: 7000, minPrice: 20000, duration: "2 hari" },
  { id: 3, name: "Setrika Saja", unit: "kg", price: 4000, minPrice: 12000, duration: "1 hari" },
  { id: 4, name: "Express", unit: "kg", price: 10000, minPrice: 30000, duration: "6 jam" },
]

export const fragrances = ["Tanpa Pewangi", "Lavender", "Ocean Fresh", "Sakura", "Lemon", "Vanilla"]

export const initialUsers = [
  { id: 1, username: "admin", password: "admin123", name: "Zahra Aulia Rahman", role: "Admin", status: "Aktif" },
  { id: 2, username: "kasir", password: "kasir123", name: "Aisha Maharani", role: "Kasir", status: "Aktif" },
]

const firstNames = [
  "Ahmad", "Siti", "Budi", "Dewi", "Eko", "Fitri", "Gunawan", "Hana", "Indra", "Julia",
  "Kurnia", "Lina", "Maman", "Nia", "Oki", "Putri", "Rizki", "Sari", "Tono", "Umar",
  "Vina", "Wawan", "Yanti", "Zaki", "Bagus", "Citra", "Doni", "Elsa", "Farid", "Gita",
]
const lastNames = [
  "Santoso", "Wijaya", "Kusuma", "Halim", "Pratama", "Saputra", "Nugroho", "Lestari",
  "Wibowo", "Utami", "Hartono", "Anggraini", "Setiawan", "Maharani", "Firmansyah",
]
const streets = [
  "Jl. Sultan Thaha",
  "Jl. Gatot Subroto",
  "Jl. Jenderal Sudirman",
  "Jl. Ahmad Yani",
  "Jl. Arif Rahman Hakim",
  "Jl. Kolonel Abunjani",
  "Jl. Pattimura",
  "Jl. Hayam Wuruk",
  "Jl. Orang Kayo Hitam",
  "Jl. H. Adam Malik"
]

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateCustomers(count = 30) {
  const customers = []
  for (let i = 1; i <= count; i++) {
    const name = `${rand(firstNames)} ${rand(lastNames)}`
    customers.push({
      id: i,
      name,
      phone: `08${randInt(11, 89)}${randInt(1000000, 9999999)}`,
      address: `${rand(streets)} No. ${randInt(1, 200)}, Jambi`,
      createdAt: randomDate(120),
    })
  }
  return customers
}

function randomDate(daysBack) {
  const d = new Date()
  d.setDate(d.getDate() - randInt(0, daysBack))
  return d.toISOString().slice(0, 10)
}

const statuses = ["Pending", "Proses", "Selesai"]

export function generateTransactions(customers, services, count = 50) {
  const transactions = []
  const todayStr = new Date().toISOString().slice(0, 10)
  for (let i = 1; i <= count; i++) {
    const customer = rand(customers)
    const service = rand(services)
    const weight = service.unit === "kg" ? randInt(2, 12) : randInt(1, 4)
    const price = weight * service.price
    
    let status = rand(statuses)
    let date = randomDate(60)
    
    // Pastikan ada transaksi hari ini dengan status Proses & Pending untuk pengujian
    if (i === 1) {
      status = "Proses"
      date = todayStr
    } else if (i === 2) {
      status = "Pending"
      date = todayStr
    }

    transactions.push({
      id: i,
      invoice: `INV-${String(2500 + i).padStart(5, "0")}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      serviceId: service.id,
      serviceName: service.name,
      unit: service.unit,
      weight,
      fragrance: rand(fragrances),
      note: "",
      date,
      status,
      price,
    })
  }
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// Data laporan keuangan bulanan (dummy)
export const monthlyFinance = [
  { month: "Jan", pemasukan: 12500000, pengeluaran: 4200000 },
  { month: "Feb", pemasukan: 13800000, pengeluaran: 4600000 },
  { month: "Mar", pemasukan: 11200000, pengeluaran: 3900000 },
  { month: "Apr", pemasukan: 15400000, pengeluaran: 5100000 },
  { month: "Mei", pemasukan: 16200000, pengeluaran: 5300000 },
  { month: "Jun", pemasukan: 14800000, pengeluaran: 4900000 },
  { month: "Jul", pemasukan: 17500000, pengeluaran: 5600000 },
  { month: "Ags", pemasukan: 18100000, pengeluaran: 5800000 },
]

export const weeklyRevenue = [
  { day: "Sen", omset: 1850000 },
  { day: "Sel", omset: 2100000 },
  { day: "Rab", omset: 1650000 },
  { day: "Kam", omset: 2400000 },
  { day: "Jum", omset: 2850000 },
  { day: "Sab", omset: 3200000 },
  { day: "Min", omset: 1450000 },
]
