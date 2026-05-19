CREATE TABLE IF NOT EXISTS mahasiswa (
    id SERIAL PRIMARY KEY,
    nim VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jurusan VARCHAR(100),
    angkatan INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dokumen (
    id SERIAL PRIMARY KEY,
    mahasiswa_id INT REFERENCES mahasiswa(id),
    nama_file VARCHAR(255) NOT NULL,
    minio_path VARCHAR(500),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO mahasiswa (nim, nama, jurusan, angkatan)
VALUES
  ('2021001', 'Andi Saputra', 'Teknik Informatika', 2021),
  ('2021002', 'Sari Dewi', 'Sistem Informasi', 2021)
ON CONFLICT DO NOTHING;
