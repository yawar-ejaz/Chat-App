const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Message = sequelize.define('message', {
    _id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    // sender: {
    //     type: DataTypes.UUID,
    //     allowNull: false,
    // },
    content: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // chat: {
    //     type: DataTypes.UUID,
    //     allowNull: false,
    // },
    // readBy: {
    //     type: DataTypes.ARRAY(DataTypes.UUID),
    //     allowNull: false,
    // }
});

// Message.belongsTo(Users, { foreignKey: 'senderId', as: 'sender' });
// Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });
// Message.belongsToMany(Users, { through: 'ReadByUsers', foreignKey: 'messageId', as: 'readBy' });

module.exports = Message;
