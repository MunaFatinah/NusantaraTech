const express = require('express')
const { Pool } = require('pg')
const Minio = require('minio')
const { validateMahasiswa } = require('./validation')

const app = express()
app.use(express.json())

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
})

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'minio',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_USER,
  secretKey: process.env.MINIO_PASSWORD,
})

const BUCKET_NAME = 'dokumen-mahasiswa'

async function initMinio() {
  const exists = await minioClient.bucketExists(BUCKET_NAME)
  if (!exists) {
    await minioClient.makeBucket(BUCKET_NAME)
    console.log(`Bucket '${BUCKET_NAME}' dibuat`)
  }
}
initMinio().catch(err => console.error('MinIO init error:', err.message))

app.get('/', (req, res) => {
  res.json({ message: 'Nusantara Tech API', status: 'ok', version: '3.0' })
})

app.get('/health', async (req, res) => {
  const result = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: { app: 'ok', database: 'unknown', minio: 'unknown' }
  }
  try {
    await pool.query('SELECT 1')
    result.services.database = 'ok'
  } catch (err) {
    result.services.database = 'error: ' + err.message
    result.status = 'degraded'
  }
  try {
    await minioClient.bucketExists(BUCKET_NAME)
    result.services.minio = 'ok'
  } catch (err) {
    result.services.minio = 'error: ' + err.message
    result.status = 'degraded'
  }
  res.status(result.status === 'ok' ? 200 : 503).json(result)
})

app.get('/mahasiswa', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM mahasiswa ORDER BY id')
    res.json({ success: true, total: result.rowCount, data: result.rows })
  } catch (err) { next(err) }
})

app.get('/mahasiswa/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID harus berupa angka' })
    const result = await pool.query('SELECT * FROM mahasiswa WHERE id = $1', [id])
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Mahasiswa tidak ditemukan' })
    res.json({ success: true, data: result.rows[0] })
  } catch (err) { next(err) }
})

app.post('/mahasiswa', async (req, res, next) => {
  try {
    const errors = validateMahasiswa(req.body)
    if (errors.length > 0) return res.status(400).json({ success: false, errors })
    const { nim, nama, jurusan, angkatan } = req.body
    const result = await pool.query(
      'INSERT INTO mahasiswa (nim, nama, jurusan, angkatan) VALUES ($1, $2, $3, $4) RETURNING *',
      [nim.trim(), nama.trim(), jurusan || null, angkatan || null]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ success: false, error: 'NIM sudah terdaftar' })
    next(err)
  }
})

app.put('/mahasiswa/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID harus berupa angka' })
    const errors = validateMahasiswa(req.body)
    if (errors.length > 0) return res.status(400).json({ success: false, errors })
    const { nim, nama, jurusan, angkatan } = req.body
    const result = await pool.query(
      'UPDATE mahasiswa SET nim=$1, nama=$2, jurusan=$3, angkatan=$4 WHERE id=$5 RETURNING *',
      [nim.trim(), nama.trim(), jurusan || null, angkatan || null, id]
    )
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Mahasiswa tidak ditemukan' })
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ success: false, error: 'NIM sudah dipakai' })
    next(err)
  }
})

app.delete('/mahasiswa/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'ID harus berupa angka' })
    const result = await pool.query('DELETE FROM mahasiswa WHERE id = $1 RETURNING *', [id])
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Mahasiswa tidak ditemukan' })
    res.json({ success: true, message: 'Mahasiswa berhasil dihapus', data: result.rows[0] })
  } catch (err) { next(err) }
})

app.post('/upload', async (req, res, next) => {
  try {
    const { nama_file, isi, mahasiswa_id } = req.body
    if (!nama_file || nama_file.trim() === '') {
      return res.status(400).json({ success: false, error: 'nama_file wajib diisi' })
    }
    const buffer = Buffer.from(isi || '')
    const minio_path = `${BUCKET_NAME}/${nama_file.trim()}`
    await minioClient.putObject(BUCKET_NAME, nama_file.trim(), buffer)
    if (mahasiswa_id) {
      await pool.query(
        'INSERT INTO dokumen (mahasiswa_id, nama_file, minio_path) VALUES ($1, $2, $3)',
        [mahasiswa_id, nama_file.trim(), minio_path]
      )
    }
    res.status(201).json({ success: true, message: 'File berhasil diupload', path: minio_path })
  } catch (err) { next(err) }
})

app.get('/files', async (req, res, next) => {
  try {
    const objects = []
    const stream = minioClient.listObjects(BUCKET_NAME, '', true)
    stream.on('data', obj => objects.push({ nama: obj.name, ukuran: obj.size }))
    stream.on('end', () => res.json({ success: true, total: objects.length, files: objects }))
    stream.on('error', err => next(err))
  } catch (err) { next(err) }
})

app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route '${req.path}' tidak ditemukan` })
})

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} — ${err.message}`)
  res.status(500).json({ success: false, error: 'Terjadi kesalahan pada server', detail: err.message })
})

app.listen(3000, () => console.log('App jalan di port 3000'))
