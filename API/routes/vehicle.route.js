const express = require("express");
const router = express.Router();
const {getVehicles,addVehicle,updateVehicle} = require("../controllers/vehicle.controller.js");
const { protect } = require('../middleware/authMiddleware.js');

router.get('/', protect ,getVehicles);
router.post('/', protect ,addVehicle);
router.put('/', protect ,updateVehicle);

module.exports = router;