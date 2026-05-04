require("dotenv").config();
const express = require("express");
const connectDB = require('./db/connectDB')
const morgan = require('morgan')
const cookieParser = require("cookie-parser");
const cors = require("cors")
const http = require("http");
const { Server } = require("socket.io");

//import Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes")
const companyRoute = require("./routes/company.routes")
const jobRoutes = require("./routes/job.routes")
const adminRoutes = require("./routes/admin.routes")
const messageRoutes = require("./routes/message.routes");
const paymentRoutes = require("./routes/payment.routes");
const learningRoutes = require("./routes/learning.routes");

//connect databse 
connectDB();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.io logic
const userSockets = new Map();

io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    userSockets.set(userId, socket.id);
  });

  socket.on("private_message", ({ receiverId, text, senderId, senderType, conversationId }) => {
    const receiverSocketId = userSockets.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", {
        senderId,
        senderType,
        text,
        conversationId,
        createdAt: new Date()
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        break;
      }
    }
  });
});

app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use("/uploads", express.static("uploads"));

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/company",companyRoute)
app.use("/api/v1/job", jobRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/learning", learningRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
