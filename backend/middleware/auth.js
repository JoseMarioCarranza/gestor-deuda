const jwt = require('jsonwebtoken');

const verificarUsuario = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No se proporcionó un token' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ error: 'Token no válido' });
        req.user = user;
        console.log(req.user);
        next();
    });
};

const verificarAdmin = (req, res, next) => {
    verificarUsuario(req, res, () => {
        if (!req.user.esAdmin) {
            return res.status(403).json({ error: 'No tienes permiso para esta acción' });
        }
        next();
    });
};


module.exports = { verificarUsuario, verificarAdmin };
