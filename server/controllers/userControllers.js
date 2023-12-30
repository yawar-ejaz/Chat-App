require('dotenv').config();
const { Op } = require("sequelize");
const multer = require("multer");
const cloudinary = require("cloudinary");

const User = require('../models/user');
const generateToken = require('../utils/generateToken');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");

const createUser = async (req, res, next) => {
    const { name, email, password, pic } = req.body;
    console.log(name);
    console.log(pic);
    return;
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

        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: err.message });
            }
            else if (err) {
                return res.status(500).json({ error: err.message });
            }
        });
        // await new Promise((resolve, reject) => {
        //     upload(req, res, async (err) => {
        //         if (err) {
        //             return reject(err);
        //         }
        //         resolve();
        //     });
        // });

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "uploads" },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )

            if (pic && pic.buffer) {
                stream.write(pic.buffer);  // Assuming pic is a Multer file object
                stream.end();
            }
            else {
                reject(new Error("No file found"));
            }
        });

        const user = await User.create({
            name,
            email,
            password: await encrypt(password),
            picture: result.secure_url
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            name: user.name,
            email: user.email,
            picture: user.picture,
            message: "Account created successfully"
        });
    } catch (error) {
        console.log(error);
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
                picture: existingUser.picture,
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