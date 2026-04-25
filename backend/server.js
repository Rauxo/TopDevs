const express = require("express");
const connectDB = require('./db/connectDB')
const morgan = require('morgan')
//import Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes")

//config env
require("dotenv").config();

//connect databse 
connectDB();
const app = express();
app.use(express.json()); // Parses JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data

//log API Call using morgan 
app.use(morgan('dev'));

//Define PORT
const PORT = process.env.PORT;

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user",userRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
