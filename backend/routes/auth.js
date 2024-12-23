const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
    try {
        const { username, nombre, apellido, password, esAdmin } = req.body;

        if (!username || !nombre || !apellido || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const nuevoUsuario = new Usuario({ username, nombre, apellido, password, esAdmin });
        await nuevoUsuario.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const usuario = await Usuario.findOne({ username });
        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }
        const token = jwt.sign({ id: usuario._id, esAdmin: usuario.esAdmin }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;