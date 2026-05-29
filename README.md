# Nusantara Tech — Sistem Informasi Akademik

Aplikasi manajemen data mahasiswa berbasis Docker dengan Node.js, Supabase (PostgreSQL), dan MinIO.

## Teknologi
- **Node.js + Express** — REST API
- **Supabase (PostgreSQL)** — Database cloud
- **MinIO** — Object storage lokal (simulasi AWS S3)
- **Docker Compose** — Orkestrasi container

## Cara Menjalankan

### Prasyarat
- Docker dan docker-compose terinstal
- Git terinstal
- Akses ke Supabase project (minta kredensial ke Mevya)

### Langkah

```bash
git clone https://github.com/[username]/nusantara-tech.git
cd nusantara-tech
cp .env.example .env
# Edit .env dengan kredensial Supabase dan MinIO
nano .env

# Tambahkan domain ke /etc/hosts
echo "127.0.0.1   nusantara-tech.local" | sudo tee -a /etc/hosts

# Jalankan
docker-compose up -d --build
```

## Akses Layanan

| Layanan | URL |
|---|---|
| API | http://nusantara-tech.local:3000 |
| Health Check | http://nusantara-tech.local:3000/health |
| MinIO Dashboard | http://nusantara-tech.local:9001 |

## Endpoint API

| Method | URL | Keterangan |
|---|---|---|
| GET | /mahasiswa | Ambil semua data mahasiswa |
| GET | /mahasiswa/:id | Ambil mahasiswa by ID |
| POST | /mahasiswa | Tambah mahasiswa baru |
| PUT | /mahasiswa/:id | Update data mahasiswa |
| DELETE | /mahasiswa/:id | Hapus mahasiswa |
| POST | /upload | Upload file ke MinIO |
| GET | /files | Lihat daftar file di MinIO |
| GET | /health | Cek status semua service |

## Anggota Tim
- Mevya — Setup Supabase, konfigurasi environment
- Muna — Backend API, koneksi database, validasi
- Flora — Domain setup, MinIO, dokumentasi
