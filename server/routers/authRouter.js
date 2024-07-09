const  express = require("express")
const router = express.Router()
const validateForm = require("./validateForm")
const {
    handleLogin, 
    postLogin, 
    register
} = require('../controllers/authController')

router.route("/login")
    .get(handleLogin)
    .post(validateForm, postLogin)

router
    .post("/register", validateForm, register)

module.exports = router;