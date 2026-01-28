const express = require("express");
const router = express.Router();
const {getUsers, updateUser} = require("../controllers/user.controller.js");
const {register, login} = require("../controllers/authController.js");


router.get('/', getUsers);
router.post('/', register);
router.put('/', updateUser);
router.post('/login', login);

module.exports = router;