Berikut ini Asha siapkan dalam bentuk **teks penuh** untuk langsung dicopas ke file `README.md`:

---

```md
# fe_isi_test_kelvintryanto

Aplikasi manajemen tugas (_task management_) yang dikembangkan sebagai bagian dari **Assessment Test** untuk posisi **Front-End Engineer** di PT. Ihsan Solusi Teknologi. Dibangun menggunakan **Next.js 15**, **TailwindCSS**, **Prisma ORM**, **PostgreSQL**, dan **Docker Compose**.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🚀 Fitur Utama

- Autentikasi menggunakan JWT
- Role pengguna: **Lead** dan **Team**
- CRUD tugas (Create, Read, Update, Delete)
- Penugasan tugas ke anggota tim
- Pelacakan status tugas: `Not Started`, `On Progress`, `Done`, `Rejected`
- Riwayat log untuk setiap perubahan tugas

---

## 🧱 Teknologi yang Digunakan

- [Next.js 15](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/)
- [Docker & Docker Compose](https://docs.docker.com/compose/)

---

## 📁 Struktur Proyek
```

fe_isi_test_kelvintryanto/
├── .env # File konfigurasi environment
├── docker-compose.yml # Konfigurasi Docker Compose
├── Dockerfile # Dockerfile untuk aplikasi
├── prisma/
│ └── schema.prisma # Skema Prisma untuk database
└── src/
├── app/ # Halaman Next.js dan API route
├── components/ # Komponen UI
├── lib/ # Konfigurasi Prisma & utilitas
└── ... # Berkas lainnya

````

---

## ⚙️ Konfigurasi Environment

Buat file `.env` di root dengan isi sebagai berikut:

```env
DATABASE_URL="postgresql://postgres:postgres@database:5432/database_ist"
JWT_SECRET_KEY=ihsansolusiteknologi
````

> ⚠️ Gunakan `database` (nama service di Docker Compose) alih-alih `localhost`, agar Prisma dapat terhubung dari dalam container.

---

## 🐳 Menjalankan dengan Docker Compose

Pastikan Anda telah menginstal [Docker Desktop](https://www.docker.com/products/docker-desktop).

### 1. Build dan Jalankan Aplikasi

```bash
docker-compose up --build
```

### 2. Akses Aplikasi

Aplikasi akan tersedia di:

```
http://localhost:3000
```

---

## 📦 Perintah Prisma Tambahan

Jika Anda ingin menjalankan migrasi secara manual:

```bash
docker exec -it frontend_isi npx prisma migrate deploy
```

---

## ✅ Status Build

✅ Build berhasil dan aplikasi berjalan dengan lancar menggunakan Docker Compose.

---
