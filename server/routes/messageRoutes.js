const express = require(`express`);
const auth = require('../middlewares/auth');
const { allMessages } = require('../controllers/messageController');


const router = express.Router();

// router.route('/').post(auth, fetchUserChat);
router.route('/:chatId').get(auth, allMessages);

module.exports = router;