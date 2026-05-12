# 🎓 Nusantara Tech — Development Environment

Proyek ini adalah "Development Environment in a Box" untuk aplikasi
sistem informasi akademik menggunakan Docker dan Docker Compose.

## 📦 Teknologi yang Digunakan

| Komponen | Teknologi | Versi |
|---|---|---|
| Web App | Node.js + Express | 20-alpine |
| Database | PostgreSQL | 15-alpine |
| Object Storage | MinIO | latest |
| GUI Database | pgAdmin | latest |

## 🏗️ Arsitektur Sistem

(diagram akan ditambahkan)

## ⚙️ Prasyarat

Pastikan sudah terinstall di laptop kamu:
- Docker Desktop (versi 24+)
- Git

## 🚀 Cara Menjalankan

### 1. Clone repository ini
\`\`\`bash
git clone https://github.com/USERNAME/nusantara-tech.git
cd nusantara-tech
\`\`\`

### 2. Buat file konfigurasi
\`\`\`bash
cp .env.example .env
# Edit file .env dan isi kredensial yang sesuai
\`\`\`

### 3. Jalankan semua service
\`\`\`bash
docker compose up -d
\`\`\`

### 4. Cek status semua container
\`\`\`bash
docker compose ps
\`\`\`

## 🌐 Cara Mengakses Layanan

| Layanan | URL | Kredensial |
|---|---|---|
| Aplikasi Web | http://localhost:3000 | - |
| MinIO Dashboard | http://localhost:9001 | lihat .env |
| pgAdmin | http://localhost:5050 | lihat .env |

## 🗄️ Cara Mengakses MinIO

(akan dilengkapi dengan screenshot minggu 3)

## 🛑 Cara Mematikan Environment

\`\`\`bash
# Matikan tapi data tetap tersimpan
docker compose down

# Matikan DAN hapus semua data (hati-hati!)
docker compose down -v
\`\`\`

## 👥 Tim Pengembang

| Nama | Peran |
|---|---|
| Muna | DevOps / Orkestrasi |
| Flora | Backend + Storage |
| Mevya | Infrastructure + Dokumentasi |

## 📸 Screenshot Pengujian

TO BE CONTINUE..
