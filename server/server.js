require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const sequelize = require('./utils/database');
const User = require('./models/user');
const Chat = require('./models/chat');
const Message = require('./models/message');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_ADDRESS
}));

app.use("/api/user/", userRoutes);
app.use(`/api/chat/`, chatRoutes);
app.use(`/api/message/`, messageRoutes);

Chat.hasMany(Message, {
    onDelete: "CASCADE",
});
Chat.belongsToMany(User, { as: "users", through: "UserChat" });
Chat.belongsTo(User, { as: "groupAdmin" });
Message.belongsTo(Chat);
Message.belongsTo(User, { as: "sender" });

async function startServer() {
    try {
        // await sequelize.sync({force: true});
        await sequelize.sync();
        app.listen(port, () => {
            console.log(`Server running on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
}

startServer();