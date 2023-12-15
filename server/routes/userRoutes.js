const express = require(`express`);
const { createUser, loginUser } = require("../controllers/userControllers");

const router = express.Router();

router.route('/sign-up').post(createUser)
router.route('/sign-in').post(loginUser)

module.exports = router;