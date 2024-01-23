const ArchivedMessage = require("../models/archivedMessage");
const Message = require("../models/message");
const { Op } = require("sequelize");

const moveAndArchiveOldMessages = async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    const oldMessages = await Message.findAll({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });

    await ArchivedMessage.bulkCreate(oldMessages.map((msg) => msg.toJSON()));

    await Message.destroy({
      where: {
        createdAt: {
          [Op.lt]: oneDayAgo,
        },
      },
    });
    console.log("Messages archieved successfully!");
  } catch (error) {
    console.log("Failed to archieve Messages: ", error);
  }
};

module.exports = moveAndArchiveOldMessages;
