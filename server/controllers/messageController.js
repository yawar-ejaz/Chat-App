require("dotenv").config();
const Chat = require("../models/chat");
const User = require("../models/user");
const Message = require("../models/message");

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
        res.json(fullMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { sendMessage };