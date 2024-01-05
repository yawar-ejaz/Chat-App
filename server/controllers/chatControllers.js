require('dotenv').config();
const sequelize = require("../utils/database");
const Chat = require('../models/chat');
const User = require('../models/user');
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
    res.send("my chats here");
};

const createGroup = async (req, res, next) => {
    const { groupName, users } = req.body;

    if (!groupName || !users) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields!",
        });
    }

    if (users.length < 2) {
        return res.status(400).json({
            success: false,
            message: "More than 2 users are required to form a group chat",
        });
    }
    users.push(req.user._id);
    // console.log(users);
    const t = await sequelize.transaction();
    try {
        let picture;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            picture = await cloudinary.uploader.upload(fileUri.content, {
                folder: "uploads",
            });
        }
        console.log(picture);

        const newChat = await Chat.create(
            {
                chatName: groupName,
                isGroupChat: true,
                groupAdminId: req.user._id,
                groupPic: picture.secure_url
            },
            { transaction: t }
        );

        const chatInstance = await Chat.findByPk(newChat._id, {
            transaction: t,
        });

        await chatInstance.addUsers(users, { transaction: t });

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

module.exports = { fetchUserChat, fetchChats, createGroup };