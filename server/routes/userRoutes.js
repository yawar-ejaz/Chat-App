const express = require(`express`);
const { createUser, loginUser, findUsersByName } = require("../controllers/userControllers");
const auth = require('../middlewares/auth');
const upload = require("../middlewares/multer");

const router = express.Router();

router.route('/sign-up').post(upload, createUser);
router.route('/sign-in').post(loginUser);
router.route('/search').get(auth, findUsersByName);

module.exports = router;