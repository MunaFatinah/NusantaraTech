const express = require('express')
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Nusantara Tech API jalan!' })
})

app.get('/mahasiswa', (req, res) => {
  res.json({ data: 'list mahasiswa' })
})

app.listen(3000, () => console.log('App jalan di port 3000'))
