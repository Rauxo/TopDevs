const express = require("express");
const connectDB = require('./db/connectDB')
const morgan = require('morgan')
const cookieParser = require("cookie-parser");
const cors = require("cors")

//import Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes")


//config env
require("dotenv").config();

//connect databse 
connectDB();
const app = express();
app.use(cookieParser());
app.use(express.json()); // Parses JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded form data

//log API Call using morgan 
app.use(morgan('dev'));

//Define PORT
const PORT = process.env.PORT;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use("/uploads", express.static("uploads"));
//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user",userRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
