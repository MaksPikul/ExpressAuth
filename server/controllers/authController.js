const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { 
    jwtSign, 
    jwtVerify, 
    getJwt } = require("./jwt/jwtAuth");
require('dotenv').config();
const { getRedisClient } = require("../redis")

module.exports.getLogin = (req, res) => {

    if (req.session.user && req.session.user.email){
        res.json({loggedIn: true, email: req.session.user.email})
    }
    else{
        res.json({loggedIn: false});
    }
}

module.exports.postLogin = async (req, res) => {

    //Check redis for email, if email found, reply awaiting confirmation
    const potentialLogin = await pool.query("SELECT id, email, passhash FROM users u WHERE u.email=$1", [req.body.email])

    if (potentialLogin.rowCount > 0){
        const samePass = await bcrypt.compare
        (req.body.password, 
        potentialLogin.rows[0].passhash);

        if (samePass) {
            req.session.user = {
            email: req.body.email,
            id : potentialLogin.rows[0].id}
            res.json({loggedIn: true, email: req.body.email})
        }
        else {
            res.json({loggedIn : false, status:"Wrong username or passsword."})
        }
    }
    else{
        res.json({loggedIn : false, status:"Wrong username or passsword."})
    }
}


//a get method?
module.exports.register = async (req, res) => {
    
    const existingUser = await pool.query(
        "SELECT email FROM users WHERE email=$1 LIMIT 1",
        [req.body.email]);

    if (existingUser.rowCount > 0){
        res.json({loggedIn:false, status: "Email already in use."})
    }
    else {
        //set token in redis

        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const redisKey = uuidv4()

        //Sign a token with email, 
        //put user object in tom

        jwtSign({
            email: req.body.email, //might not be necessary
            key: redisKey
        },process.env.JWT_SECRET,
        {expiresIn: "5min"},)
        .catch(err => {
            console.log(err)
            res.json({loggedIn: false, status: "Something went wrong"})
        })
        .then(async (token) =>{
            //res.json({loggedIn: true, token})

            const userObj = {
                //name: name,
                email: req.body.email,
                password: hashedPass,
            }
    
            await getRedisClient()
            .multi()
            .hmset(redisKey, userObj)
            .expire(redisKey, 60 * 5)
            .exec()
    
            //send email
            await sendVerificationEmail(req.body.email, token)
                .then()
            
            res.json({status: "Verification email sent"})
        })
    }
}

module.exports.verifySignUpEmail = async (req, res) => {
    const token = getJwt(req)
    
    if (!token) {
        res.json({loggedIn: false});
        return
    }
    jwtVerify(token, process.env.JWT_SECRET)
    .catch(err => {
        console.log(err)
        // redirect
    })
    .then( async (data)=>{
        //res.json({ loggedIn: true, token});

        const redisResult = await getRedisClient()
        .multi()
        .hgetall(data.key)
        .del(data.key)
        .exec();

        if (!redisResult || redisResult[0][0]){
            return {error: "Token does not exist or has expired"}
        }

        const cachedAccount = redisResult[0][1] 

        if (!cachedAccount.name ||
            !cachedAccount.email ||
            !cachedAccount.password
        ) {
            return {error: "Cached account missing values to verify"}
        }

        const newUserQuery = await pool.query(
            "INSERT INTO users(email, passhash) values ($1, $2) RETURNING id, email",
            [cachedAccount.email, cachedAccount.password]);
        
        req.session.user = {
            email: cachedAccount.email,
            id: newUserQuery.rows[0].id
        }
        // redirect to email confirmed which redirects to login

        res.redirect("/")
        //res.json({loggedIn: true, email: cachedAccount.email})
    })

}