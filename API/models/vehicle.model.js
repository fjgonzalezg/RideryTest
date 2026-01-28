const mongoose = require('mongoose');

const VehicleSchema = mongoose.Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        model: {
            type: String,
            required: true,
        },
        vehicleStatus: {
            type: String,
            required: true
        },
        yearOfFabrication: {
            type: Number,
            required: true
        },
        createdBy: {
            type: String,
            required: false
        },
        updatedBy: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
    }

);

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
module.exports = Vehicle;