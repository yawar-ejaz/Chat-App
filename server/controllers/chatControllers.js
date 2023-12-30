const sequelize = require("../utils/database");
const Chat = require('../models/chat');
const User = require('../models/user');
const { Op } = require("sequelize");

const fetchUserChat = async (req, res, next) => {
    const userId = req.body._id;
    // res.send([userId, req.user._id])

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
    // try {
    //     const userChats = await Chat.findAll({
    //         include: [
    //             {
    //                 model: User,
    //                 as: "users",
    //                 attributes: [_id],
    //                 through: { attributes: [] },
    //             },
    //         ],
    //         order: [["updatedAt", "DESC"]],
    //     });
    //     res.json(userChats);
    // } catch (error) {
    //     console.log(error);
    //     return res.status(500).json({
    //         success: false,
    //         message: error.message,
    //     });
    // }
    res.send("my chats here");
};

module.exports = { fetchUserChat, fetchChats };