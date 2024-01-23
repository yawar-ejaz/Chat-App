const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const ArchivedMessage = sequelize.define("archivedMessage", {
  _id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = ArchivedMessage;
