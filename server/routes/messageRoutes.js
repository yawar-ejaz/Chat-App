const express = require(`express`);
const auth = require('../middlewares/auth');
const { sendMessage } = require('../controllers/messageController');


const router = express.Router();

router.route('/:chatId').post(auth, sendMessage);


module.exports = router;