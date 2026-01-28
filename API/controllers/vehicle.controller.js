const Vehicle = require('../models/vehicle.model.js');

const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const addVehicle = async (req, res) => {
  try {
      const vehicle = await Vehicle.create(req.body);
      res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.find({_id: req.body.id});
        console.log(vehicle);
        if(vehicle){
            await Vehicle.findByIdAndUpdate(req.body.id, req.body);
            const updatedVehicle = await Vehicle.findById(req.body.id);
            return res.status(200).json(updatedVehicle);
        }
        res.status(404).json({message: "ID does not exists"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getVehicles,
    addVehicle,
    updateVehicle
}