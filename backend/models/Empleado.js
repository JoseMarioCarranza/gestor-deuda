const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true }
});

module.exports = mongoose.model('Empleado', empleadoSchema);
