require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
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



Chat.hasMany(Message);
Message.belongsTo(Chat);
Chat.belongsTo(User, { as: "groupAdmin" });
Message.belongsTo(User, { as: "sender" });
Message.belongsToMany(User, { as: "users", through: "UserMessage" });
Chat.belongsToMany(User, { as: "users", through: "UserChat" });

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
