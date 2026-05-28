function validateMahasiswa(data) {
  const errors = []
  if (!data.nim || data.nim.trim() === '') errors.push('NIM wajib diisi')
  else if (data.nim.trim().length > 20) errors.push('NIM maksimal 20 karakter')
  if (!data.nama || data.nama.trim() === '') errors.push('Nama wajib diisi')
  else if (data.nama.trim().length > 100) errors.push('Nama maksimal 100 karakter')
  if (data.angkatan) {
    const t = parseInt(data.angkatan)
    if (isNaN(t) || t < 2000 || t > 2100) errors.push('Angkatan harus tahun valid')
  }
  return errors
}
module.exports = { validateMahasiswa }
