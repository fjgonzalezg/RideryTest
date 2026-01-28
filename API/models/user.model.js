const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber : {
            type: Number,
            required: false
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }

);

const User = mongoose.model("User", UserSchema);
module.exports = User;
