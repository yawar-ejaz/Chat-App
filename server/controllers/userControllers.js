const { Op } = require("sequelize");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/dataParser");
const User = require('../models/user');
const generateToken = require('../utils/generateToken');
const { encrypt, isMatching } = require("../utils/hashing");

const createUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
        return res.status(400).json({
            success: false,
            message: "All the fields are required!",
        });
    }

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

        let picture;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            picture = await cloudinary.uploader.upload(fileUri.content, {
                folder: "uploads",
            });
        }

        const user = await User.create({
            name,
            email,
            password: await encrypt(password),
            picture: picture?.secure_url || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            message: "Account created successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error creating user or uploading image"
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
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                picture: existingUser.picture,
                message: "Login successful"
            });
        }

        res.status(401).json({
            success: false,
            message: "Incorrect password"
        });

    } catch (error) {
        console.log(error);
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