const jwt = require('jsonwebtoken');
const JWT_SECRET='ProyectoPruebaPalabraSecreta2026';

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {

      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { id: decoded.id };
      next();

    } catch (error) {
      console.error('Error en el token:', error.message);
      res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }


  if (!token) {
    res.status(401).json({ message: 'No autorizado, no se proporcionó token' });
  }
};

module.exports = { protect };