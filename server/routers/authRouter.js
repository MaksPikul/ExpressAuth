const  express = require("express")
const router = express.Router()
const validateForm = require("./validateForm")
const {
    getLogin, 
    postLogin, 
    register
} = require('../controllers/authController')

router.route("/login")
    .get(getLogin)
    .post(validateForm, postLogin)

router
    .post("/register", validateForm, register)

module.exports = router;