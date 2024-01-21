const User = require("../models/user");
const Message = require("../models/message");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/dataParser");

const sendMessage = async (req, res, next) => {
  const chatId = req.params.chatId;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message content is required!",
    });
  }

  const newMessage = {
    senderId: req.user._id,
    content: message,
    chatId,
  };

  try {
    const message = await Message.create(newMessage);

    const fullMessage = await Message.findByPk(message._id, {
      include: [
        { model: User, as: "sender", attributes: ["name", "picture", "email"] },
      ],
    });
    const io = req.app.get("socketio");
    if (io) {
      io.to(chatId).emit("new-message", fullMessage);
    }
    res.json(fullMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const sendFile = async (req, res, next) => {
  const chatId = req.params.chatId;
  const { fileName } = req.body;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File content is required!",
    });
  }

  try {
    let response;

    if (req.file) {
      const fileUri = getDataUri(req.file);
      response = await cloudinary.uploader.upload(fileUri.content, {
        folder: "attachments",
        resource_type: "auto",
      });
    }

    const newMessage = {
      senderId: req.user._id,
      content: fileName,
      fileUrl: response?.secure_url,
      chatId,
    };

    const message = await Message.create(newMessage);

    const fullMessage = await Message.findByPk(message._id, {
      include: [
        { model: User, as: "sender", attributes: ["name", "picture", "email"] },
      ],
    });
    const io = req.app.get("socketio");
    if (io) {
      io.to(chatId).emit("new-message", fullMessage);
    }
    res.json(fullMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { sendMessage, sendFile };
