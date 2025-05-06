const mongoose = require('mongoose');

const EnvioSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  telefono: { type: String, required: true },
  referencia: { type: String },
  observacion: { type: String },
  productos: [
    {
      descripcion: { type: String, required: true },
      peso: { type: Number, required: true },
      bultos: { type: Number, required: true },
      fecha_entrega: { type: Date, required: true },
    },
  ],
}, { collection: 'envio' });

module.exports = mongoose.model('Envio', EnvioSchema);