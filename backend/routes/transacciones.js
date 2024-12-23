const express = require('express');
const Transaccion = require('../models/Transaccion');
const { verificarAdmin, verificarUsuario } = require('../middleware/auth');

const router = express.Router();

// Obtener transacciones por empleado
router.get('/:empleadoId', verificarUsuario, async (req, res) => {
    try {
        const { empleadoId } = req.params;
        const transacciones = await Transaccion.find({ empleadoId });
        res.json(transacciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener transacciones' });
    }
});

// Crear una nueva transacción (solo administradores)
router.post('/', verificarAdmin, async (req, res) => {
    try {
        const { empleadoId, tipo, descripcion, monto, fecha } = req.body;
        const nuevaTransaccion = new Transaccion({
            empleadoId,
            tipo,
            descripcion,
            monto,
            fecha: fecha || Date.now() // Usa la fecha proporcionada o la actual
        });
        await nuevaTransaccion.save();
        res.status(201).json(nuevaTransaccion);
    } catch (error) {
        console.error("Error al crear transacción:", error);
        res.status(500).json({ error: 'Error al crear transacción' });
    }
});


// Eliminar una transacción (solo administradores)
router.delete('/:id', verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Transaccion.findByIdAndDelete(id);
        res.json({ message: 'Transacción eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar transacción' });
    }
});

router.get('/:empleadoId', verificarUsuario, async (req, res) => {
    try {
        const { tipo, descripcion, desde, hasta } = req.query;
        const { empleadoId } = req.params;

        const filtro = { empleadoId };

        if (tipo) filtro.tipo = tipo;
        if (descripcion) filtro.descripcion = { $regex: descripcion, $options: 'i' };
        if (desde || hasta) {
            filtro.fecha = {};
            if (desde) filtro.fecha.$gte = new Date(desde);
            if (hasta) filtro.fecha.$lte = new Date(hasta);
        }

        const transacciones = await Transaccion.find(filtro);
        res.json(transacciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener transacciones' });
    }
});

module.exports = router;
