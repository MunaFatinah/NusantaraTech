# NusantaraTech — Sistem Informasi Akademik Mahasiswa

Aplikasi berbasis web untuk manajemen data mahasiswa dan dokumen akademik, dikembangkan menggunakan Node.js, PostgreSQL, dan MinIO, serta dijalankan melalui Docker Compose.

## Teknologi yang Digunakan
- Node.js + Express — REST API
- PostgreSQL — Basis data utama
- MinIO — Penyimpanan file dan dokumen
- Docker Compose — Orkestrasi container

## Cara Menjalankan

```bash
git clone https://github.com/MunaFatinah/NusantaraTech.git
cd NusantaraTech
cp .env.example .env
docker-compose up -d
```

## Endpoint API

**Mahasiswa**
- `GET /` — Memeriksa status API
- `GET /mahasiswa` — Mengambil seluruh data mahasiswa
- `GET /mahasiswa/:id` — Mengambil data mahasiswa berdasarkan ID
- `POST /mahasiswa` — Menambahkan data mahasiswa baru
- `DELETE /mahasiswa/:id` — Menghapus data mahasiswa

**File & Dokumen**
- `POST /upload` — Mengunggah file ke MinIO
- `GET /files` — Menampilkan daftar file yang telah diunggah

## Akses Layanan
- API: http://localhost:3000
- Dashboard MinIO: http://localhost:9001

## Progress Minggu Kedua

Pada minggu kedua, pengembangan difokuskan pada implementasi fitur utama meliputi basis data, REST API, dan sistem penyimpanan file.

### Pembagian Tugas

**Mevya — Database**
- Merancang skema tabel mahasiswa dan dokumen pada PostgreSQL
- Membuat file init.sql untuk inisialisasi basis data secara otomatis
- Memperbarui konfigurasi docker-compose untuk memuat skema basis data

**Muna — Backend API**
- Mengembangkan seluruh endpoint REST API (GET, POST, DELETE)
- Mengintegrasikan Express dengan PostgreSQL menggunakan library pg
- Melakukan pengujian endpoint menggunakan curl

**Flora — File Storage & Dokumentasi**
- Mengintegrasikan MinIO ke dalam aplikasi untuk fitur unggah dan penampilan daftar file
- Mengonfigurasi pembuatan bucket secara otomatis saat aplikasi pertama kali dijalankan
- Menyusun dokumentasi README

