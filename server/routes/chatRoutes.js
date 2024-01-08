const express = require(`express`);
const { fetchUserChat, fetchChats, createGroup, allMessages } = require('../controllers/chatControllers')
const auth = require('../middlewares/auth');
const upload = require("../middlewares/multer");


const router = express.Router();

// router.route('/').post(auth, fetchUserChat);
router.route('/').get(auth, fetchChats);
router.route('/create-group').post(auth, upload, createGroup);
router.route('/:chatId').get(auth, allMessages);


module.exports = router;