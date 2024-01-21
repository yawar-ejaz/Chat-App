const express = require(`express`);
const {  fetchChats, createGroup, allMessages, updateGroup } = require('../controllers/chatControllers')
const auth = require('../middlewares/auth');
const upload = require("../middlewares/multer");


const router = express.Router();

// router.route('/').post(auth, fetchUserChat);
router.route('/').get(auth, fetchChats);
router.route('/group').post(auth, upload, createGroup);
router.route('/group/:chatId').patch(auth, updateGroup);
router.route('/:chatId').get(auth, allMessages);


module.exports = router;