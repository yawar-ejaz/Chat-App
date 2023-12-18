const { encrypt, isMatching } = require("../utils/hashing");
const { Op } = require("sequelize");

const User = require('../models/user');
const generateToken = require('../utils/generateToken');

const createUser = async (req, res, next) => {
    const { name, email, password, pic } = req.body;
    try {
        const existingUser = await User.findOne({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email id already exists"
            })
        }

        const user = await User.create({
            name,
            email,
            password: await encrypt(password),
            picture: pic
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            name: user.name,
            email: user.email,
            message: "Account created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({
            where: { email: email }
        });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User not exists!"
            });
        }

        if (await isMatching(password, existingUser.password)) {

            return res.status(200).json({
                success: true,
                token: generateToken(existingUser._id),
                name: existingUser.name,
                email: existingUser.email,
                message: "Login successful"
            });
        }

        res.status(401).json({
            success: false,
            message: "Incorrect password"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const findUsersByName = async (req, res, next) => {
    const name = req.query.search;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Please provide a name!",
        });
    }

    try {
        const users = await User.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`,
                },
                _id: {
                    [Op.not]: req.user._id,
                },
            },
            attributes: { exclude: ["password"] },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error`
        });
    }
};

module.exports = { createUser, loginUser, findUsersByName };