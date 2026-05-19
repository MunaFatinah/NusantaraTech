
const express = require('express')
const { Pool } = require('pg')

const app = express()
app.use(express.json())

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

app.get('/', (req, res) => {
  res.json({ message: 'Nusantara Tech API jalan!', status: 'ok' })
})

app.get('/mahasiswa', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mahasiswa ORDER BY id')
    res.json({ data: result.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/mahasiswa/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM mahasiswa WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' })
    }
    res.json({ data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/mahasiswa', async (req, res) => {
  const { nim, nama, jurusan, angkatan } = req.body
  try {
    const result = await pool.query(
      'INSERT INTO mahasiswa (nim, nama, jurusan, angkatan) VALUES ($1, $2, $3, $4) RETURNING *',
      [nim, nama, jurusan, angkatan]
    )
    res.status(201).json({ data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/mahasiswa/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM mahasiswa WHERE id = $1', [req.params.id])
    res.json({ message: 'Mahasiswa berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const Minio = require('minio')

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
    console.log(`Bucket '${BUCKET_NAME}' berhasil dibuat`)
  }
}
initMinio().catch(console.error)

app.post('/upload', async (req, res) => {
  const { nama_file, isi } = req.body
  try {
    const buffer = Buffer.from(isi || 'kosong')
    await minioClient.putObject(BUCKET_NAME, nama_file, buffer)
    res.json({ message: 'File berhasil diupload', path: `${BUCKET_NAME}/${nama_file}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/files', async (req, res) => {
  try {
    const objects = []
    const stream = minioClient.listObjects(BUCKET_NAME, '', true)
    stream.on('data', obj => objects.push(obj.name))
    stream.on('end', () => res.json({ files: objects }))
    stream.on('error', err => res.status(500).json({ error: err.message }))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3000, () => console.log('App jalan di port 3000'))
