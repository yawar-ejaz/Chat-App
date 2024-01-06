const Chat = require("../models/chat")
const Message = require("../models/message");
const User = require("../models/user");

const allMessages = async (req, res, next) => {
    const chatId = req.params.chatId;

    try {
        const messages = await Message.findAll({
            where: { chatId },
            include: [
                { model: Chat },
                { model: User, as: "sender", attributes: ["name", "picture", "email"] },
                // {
                //     model: User,
                //     as: "users",
                //     attributes: ["name", "picture", "email"],
                // },
                // {
                //     model: User,
                //     as: "groupAdmin",
                //     attributes: ["name", "picture", "email"],
                // },
            ],
            order: [["createdAt", "ASC"]],
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

module.exports = { allMessages };