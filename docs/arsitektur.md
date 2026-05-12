ARSITEKTUR SISTEM NUSANTARA TECH
=================================

[Browser/User]
     |
     | HTTP :3000
     v
[APP SERVICE - Node.js]  <-- koneksi DB -->  [DATABASE - PostgreSQL :5432]
     |                                              |
     | upload file                             db_data (volume)
     v
[MINIO SERVICE :9000]
     |
minio_data (volume)

Dashboard MinIO: :9001
Dashboard pgAdmin: :5050 (bonus)

Semua service terhubung dalam: nusantara_network (bridge)
