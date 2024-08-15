const  express = require("express")
const router = express.Router()
const validateForm = require("./validateForm")
const rateLimit = require("../rate-limiter")


const {
    getLogin, 
    postLogin, 
    register,
    verifySignUpEmail
} = require('../controllers/authController')

router.route("/login")
    .get(getLogin)
    //.post(validateForm, rateLimit, postLogin)

router
    .post("/register", validateForm, register)

router
    .post("/verification/:token", verifySignUpEmail)


module.exports = router;