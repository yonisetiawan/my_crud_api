const mongoose = require('mongoose');

const daftarSchema = new mongoose.Schema({
  nama: { type: String, required: true, unique: true },
  alamat: { type: String, required: true },
  nomor_telepon: { type: String, required: true },
  jenis_kelamin: { type: String, required: true },
});

module.exports = mongoose.model('Daftar', daftarSchema);
