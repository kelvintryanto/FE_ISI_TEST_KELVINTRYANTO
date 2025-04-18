# fe_isi_test_kelvintryanto

Aplikasi manajemen tugas (task management) yang dikembangkan sebagai bagian dari _Assessment Test_ untuk posisi Front-End Engineer di PT. Ihsan Solusi Teknologi. Aplikasi ini dibuat menggunakan **Next.js 15**, **TailwindCSS**, **Prisma ORM**, **PostgreSQL**, dan **Docker Compose**.

## 🚀 Fitur Utama

- Autentikasi menggunakan JWT
- Role pengguna: **Lead** dan **Team**
- CRUD tugas (Create, Read, Update, Delete)
- Assign tugas ke anggota tim
- Pelacakan status tugas: `Not Started`, `On Progress`, `Done`, `Rejected`
- Riwayat log setiap perubahan tugas

## 🧱 Teknologi yang Digunakan

- [Next.js 15](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/)
- [Docker & Docker Compose](https://docs.docker.com/compose/)

## 📁 Struktur Proyek

```
fe_isi_test_kelvintryanto/
├── .env                  # File konfigurasi environment
├── docker-compose.yml   # File konfigurasi Docker Compose
├── Dockerfile           # Dockerfile untuk aplikasi
├── prisma/
│   └── schema.prisma    # Skema Prisma untuk database
└── src/
    ├── app/             # Folder halaman Next.js dan API route
    ├── components/      # Komponen UI
    ├── lib/             # Fungsi utilitas dan konfigurasi Prisma
    └── ...              # Berkas tambahan lainnya
```

## ⚙️ Persiapan Environment

Buat file `.env` di root dengan isi sebagai berikut:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/database_ist"
JWT_SECRET_KEY=ihsansolusiteknologi
```

## 🐳 Menjalankan dengan Docker Compose

Pastikan Anda telah menginstal [Docker Desktop](https://www.docker.com/products/docker-desktop/) dan `docker-compose` sudah tersedia di sistem.

### 1. Build dan Jalankan Aplikasi

```bash
docker-compose up --build
```

### 2. Akses Aplikasi

Aplikasi akan tersedia di:

```
http://localhost:3000
```

## 📦 Perintah Tambahan

Jika Anda ingin menjalankan Prisma migrate secara manual:

```bash
docker exec -it <container_name> npx prisma migrate deploy
```

> Gantilah `<container_name>` dengan nama container aplikasi Anda.

## ✅ Status Build

-
