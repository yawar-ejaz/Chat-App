const sequelize = require("../utils/database");
const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");
const getDataUri = require("../utils/dataParser");
const cloudinary = require("cloudinary");

const fetchChats = async (req, res, next) => {
  try {
    const userChats = await Chat.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: [],
          where: {
            _id: req.user._id,
          },
          through: { attributes: [] },
        },
      ],
      order: [["updatedAt", "DESC"]],
    });
    res.json(userChats);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createGroup = async (req, res, next) => {
  const { groupName, users } = req.body;

  if (!groupName || !users) {
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields!",
    });
  }
  usersArr = users.split(",");

  if (usersArr.length < 2) {
    return res.status(400).json({
      success: false,
      message: "More than 2 users are required to form a group chat",
    });
  }

  const t = await sequelize.transaction();

  try {
    let picture;
    if (req.file) {
      console.log(req.file);
      const fileUri = getDataUri(req.file);
      picture = await cloudinary.uploader.upload(fileUri.content, {
        folder: "uploads",
      });
    }

    const newChat = await Chat.create(
      {
        chatName: groupName,
        isGroupChat: true,
        groupAdminId: req.user._id,
        picture:
          picture?.secure_url ||
          "https://icon-library.com/images/group-icon-png/group-icon-png-23.jpg",
      },
      { transaction: t }
    );

    const chatInstance = await Chat.findByPk(newChat._id, {
      transaction: t,
    });

    await chatInstance.addUsers([req.user._id, ...usersArr], {
      transaction: t,
    });

    await t.commit();

    const io = req.app.get("socketio");
    if (io) {
      usersArr.forEach((user) => {
        io.emit(`new-chat-${user}`, chatInstance);
      });
    }

    res.status(200).json({
      success: true,
      message: "Group created successfully",
      group: chatInstance,
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const allMessages = async (req, res, next) => {
  const chatId = req.params.chatId;

  try {
    const totalMessages = await Message.count({ where: { chatId } });
    const messages = await Chat.findByPk(chatId, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["_id", "name", "picture", "email"],
          through: { attributes: [] },
        },
        {
          model: Message,
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["name", "picture", "email"],
            },
          ],
          separate: true,
          order: [["createdAt", "ASC"]],
          limit: 10,
          offset: totalMessages > 10 ? totalMessages - 10 : 0,
        },
      ],
    });

    if (!messages) {
      return res.status(404).json({
        success: false,
        message: "No message found for given chat Id!",
      });
    }

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateGroup = async (req, res, next) => {
  const { id } = req.body;
  const type = req.query.type;
  const chatId = req.params.chatId;
  const t = await sequelize.transaction();
  const userIds = Array.isArray(id) ? id : [id];

  try {
    const chatInstance = await Chat.findByPk(chatId, {
      transaction: t,
    });

    const io = req.app.get("socketio");

    if (type === "remove") {
      await chatInstance.removeUsers(id, { transaction: t });
      if (io) {
        userIds.forEach((userId) => {
          io.emit(`chat-remove-${userId}`, chatInstance);
        });
      }
    } else {
      await chatInstance.addUsers(id, { transaction: t });
      if (io) {
        userIds.forEach((userId) => {
          io.emit(`new-chat-${userId}`, chatInstance);
        });
      }
    }
    const totalMessages = await Message.count({ where: { chatId } });
    const updatedGroup = await Chat.findByPk(chatId, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["_id", "name", "picture", "email"],
          through: { attributes: [] },
        },
        {
          model: Message,
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["name", "picture", "email"],
            },
          ],
          separate: true,
          order: [["createdAt", "ASC"]],
          limit: 10,
          offset: totalMessages > 10 ? totalMessages - 10 : 0,
        },
      ],
      transaction: t,
    });
    await t.commit();

    if (io) {
      io.to(chatId).emit("update-group", updatedGroup);
    }
    return res.json(updatedGroup);
  } catch (error) {
    console.log(error);
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { fetchChats, createGroup, allMessages, updateGroup };
