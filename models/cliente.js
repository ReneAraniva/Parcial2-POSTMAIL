const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  credito: { type: Number, required: true },
}, { collection: 'cliente' }); 

module.exports = mongoose.model('Cliente', ClienteSchema);