const User = require('../models/user.model.js');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

const updateUser = async (req, res) => {
    try {
        const users = await User.find({});
        for (const person of users) {
            if(req.id === person._id){
                await User.findByIdAndUpdate(req.body.id, req.body);
                const updatedUser = await User.findById(req.body.id);
                return res.status(200).json(updatedUser);
            }
        }
        res.status(404).json({message: "ID does not exists"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


module.exports = {
    getUsers,
    updateUser
}