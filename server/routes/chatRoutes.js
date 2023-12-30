const express = require(`express`);
const { fetchUserChat, fetchChats } = require('../controllers/chatControllers')
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/').post(auth, fetchUserChat);
router.route('/all-chats').get(auth, fetchChats);

module.exports = router;