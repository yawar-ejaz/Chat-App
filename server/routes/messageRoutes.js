const express = require(`express`);
const auth = require('../middlewares/auth');
const { sendMessage, sendFile } = require('../controllers/messageController');
const upload = require("../middlewares/multer");

const router = express.Router();

router.route('/:chatId').post(auth, sendMessage);
router.route('/attachment/:chatId').post(upload, auth, sendFile);

module.exports = router;