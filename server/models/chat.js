const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Chat = sequelize.define('chat', {
    _id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    chatName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isGroupChat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    picture: {
        type: DataTypes.STRING,
        defaultValue: "https://icon-library.com/images/group-icon-png/group-icon-png-23.jpg"
    }
});

module.exports = Chat;