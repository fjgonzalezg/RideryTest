const express = require('express')
const mongoose = require('mongoose');
const usersRoute = require("./routes/user.route.js");
const vehicleRoute = require("./routes/vehicle.route.js");
const cors = require('cors');
const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use("/api/users", usersRoute);
app.use("/api/vehicles", vehicleRoute);

//connection to database and initialize API
mongoose.connect('mongodb+srv://admin:1234Asd*@backenddb.biykhtr.mongodb.net/Node-API?appName=BackendDB')
  .then(() => {
    console.log('Connected to database!');
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
    });
   })
  .catch(()=>{
    console.log('Connection Failed!');
  });