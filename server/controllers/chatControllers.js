require('dotenv').config();
const sequelize = require("../utils/database");
const Chat = require('../models/chat');
const User = require('../models/user');
const Message = require('../models/message');
const { Op } = require("sequelize");
const getDataUri = require("../utils/dataParser");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const fetchUserChat = async (req, res, next) => {
    const userId = req.body._id;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User Id is required!",
        });
    }

    if (req.user._id === userId) {
        return res.status(400).json({
            success: false,
            message: "Please don't give your own User Id!",
        });
    }

    const t = await sequelize.transaction();
    try {
        const existingChat = await Chat.findOne({
            where: {
                isGroupChat: false,
            },
            include: [
                {
                    model: User,
                    as: "users",
                    where: {
                        _id: { [Op.in]: [req.user._id, userId] },
                    },
                    attributes: [], // Include no attributes from the User model
                    through: { attributes: [] },
                    required: true,
                    duplicating: false,
                },
            ],
            group: ["chat._id"],
            having: sequelize.literal("COUNT(DISTINCT users._id) = 2"),
            transaction: t,
        });

        if (existingChat) {
            return res.json(existingChat);
        }

        const createdChat = await Chat.create({
            chatName: "Duo chat",
            isGroupChat: false,
            groupAdminId: null,
        }, { transaction: t }
        );
        await createdChat.addUsers([req.user._id, userId], { transaction: t });
        await t.commit();

        res.status(201).json(createdChat);
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

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

    usersArr.push(req.user._id);
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
                picture: picture?.secure_url || "https://icon-library.com/images/group-icon-png/group-icon-png-23.jpg"
            },
            { transaction: t }
        );

        const chatInstance = await Chat.findByPk(newChat._id, {
            transaction: t,
        });

        await chatInstance.addUsers(usersArr, { transaction: t });

        await t.commit();
        res.status(200).json({
            success: true,
            message: "Group created successfully",
        });
    } catch (error) {
        console.log(error);
        await t.rollback();
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const allMessages = async (req, res, next) => {
    const chatId = req.params.chatId;

    try {
        const messages = await Chat.findByPk(chatId, {
            include: [
                {
                    model: User,
                    as: "users",
                    attributes: ["name", "picture", "email"],
                },
                {
                    model: Message,
                    include: [
                        {
                            model: User,
                            as: "sender",
                            attributes: ["name", "picture", "email"],
                        }
                    ],
                    order: [["createdAt", "DESC"]]
                }
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

module.exports = { fetchUserChat, fetchChats, createGroup, allMessages };