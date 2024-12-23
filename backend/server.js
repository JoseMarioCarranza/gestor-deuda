require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB conectado"))
    .catch(err => console.error("Error al conectar a MongoDB:", err));

// Middleware
app.use(cors());
app.use(express.json()); // Manejar cuerpos en formato JSON
app.use(express.urlencoded({ extended: true })); // Manejar cuerpos en formato x-www-form-urlencoded

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/empleados', require('./routes/empleados'));
app.use('/api/transacciones', require('./routes/transacciones'));

// Inicio del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
