require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const sequelize = require("./utils/database");
const User = require("./models/user");
const Chat = require("./models/chat");
const Message = require("./models/message");
const cloudinary = require("cloudinary");
const cron = require("node-cron");
const moveAndArchiveOldMessages = require("./services/archiveMessages")

const port = process.env.PORT || 3000;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ADDRESS,
  })
);

app.use("/api/user/", userRoutes);
app.use(`/api/chat/`, chatRoutes);
app.use(`/api/message/`, messageRoutes);

Chat.hasMany(Message, {
  onDelete: "CASCADE",
});
Chat.belongsToMany(User, { as: "users", through: "UserChat" });
Chat.belongsTo(User, { as: "groupAdmin" });
Message.belongsTo(Chat);
Message.belongsTo(User, { as: "sender" });

cron.schedule("0 0 0 * * *", moveAndArchiveOldMessages, {
  timezone: "Asia/Kolkata",
});

async function startServer() {
  try {
    // await sequelize.sync({ force: true });
    await sequelize.sync();
    const server = app.listen(port, () =>
      console.log(`Server listening on port: ${port}`)
    );
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_ADDRESS,
      },
    });
    app.set("socketio", io);

    io.on("connection", (socket) => {
      console.log("User connected", socket.id);

      socket.on("join-chat", (chatId) => {
        socket.join(chatId);
        console.log("User joined chat", chatId);
      });

      socket.on("leave-chat", (chatId) => {
        socket.leave(chatId);
        console.log("User left chat", chatId);
      });

      socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();
