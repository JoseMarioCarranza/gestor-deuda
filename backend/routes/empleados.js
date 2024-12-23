const express = require('express');
const Empleado = require('../models/Empleado');
const { verificarAdmin, verificarUsuario } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los empleados
router.get('/', async (req, res) => {
    try {
        const empleados = await Empleado.find();
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener empleados' });
    }
});

router.get('/:empleadoId', verificarUsuario, async (req, res) => {
    try {
        const { empleadoId } = req.params;
        const { tipo, desde, hasta } = req.query;

        const filtro = { empleadoId };

        if (tipo) {
            filtro.tipo = tipo;
        }

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

// Crear un nuevo empleado (solo administradores)
router.post('/', verificarAdmin, async (req, res) => {
    try {
        const { nombre, apellido } = req.body;
        const nuevoEmpleado = new Empleado({ nombre, apellido });
        await nuevoEmpleado.save();
        res.status(201).json(nuevoEmpleado);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear empleado' });
    }
});

// Eliminar un empleado (solo administradores)
router.delete('/:id', verificarAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Empleado.findByIdAndDelete(id);
        res.json({ message: 'Empleado eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar empleado' });
    }
});

module.exports = router;
