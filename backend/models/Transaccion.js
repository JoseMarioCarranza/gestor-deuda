const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
    empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado', required: true },
    tipo: { type: String, enum: ['Sobrante', 'Faltante', 'Abono', 'Préstamo'], required: true },
    descripcion: { type: String },
    fecha: { type: Date, default: Date.now },
    monto: { type: Number, required: true }
});

module.exports = mongoose.model('Transaccion', transaccionSchema);
