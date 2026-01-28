const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model.js');
const JWT_SECRET='ProyectoPruebaPalabraSecreta2026';



const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '2d',
  });
};


const register = async (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;

  try {
    const userExists = await User.find({email: email});
    if (userExists.length >= 1) {
      return res.status(409).json({ message: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      fullName,
      email,
      phoneNumber,
      password: hashedPassword 
    };

    const user_created = await User.create(newUser);
    res.status(200).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user_created._id.toString(),
        nombre: user_created.fullName,
        email: user_created.email,
        phoneNumber: user_created.phoneNumber
      },
      token: generateToken(user_created._id.toString())
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({email: email});

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        message: 'Bienvenido',
        user: {
            id: user._id.toString(),
            nombre: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber
        },
        token: generateToken(user._id.toString())
      });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

module.exports = { register, login };