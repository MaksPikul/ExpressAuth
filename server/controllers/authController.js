const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { 
    jwtSign, 
    jwtVerify, 
    getJwt } = require("./jwt/jwtAuth");
require('dotenv').config();

module.exports.getLogin = (req, res) => {

    const token = getJwt(req)

    if (!token) {
        res.json({loggedIn: false});
        return
    }

    jwtVerify(token, process.env.JWT_SECRET)
    .catch(err => {
        console.log(err)
        
    })
    .then(()=>{
        res.json({ loggedIn: true, token});
    })

}

module.exports.postLogin = async (req, res) => {
       
    const potentialLogin = await pool.query("SELECT id, email, passhash FROM users u WHERE u.email=$1", [req.body.email])

    if (potentialLogin.rowCount > 0){
        const samePass = bcrypt.compare
        (req.body.password, 
        potentialLogin.rows[0].passhash);

        if (samePass) {
            
            jwtSign({
                email: req.body.email,
                id: potentialLogin.rows[0].id,
                userId: potentialLogin.rows[0].userId
            },process.env.JWT_SECRET,
            {expiresIn: "1min"},)
            .catch(err => {
                console.log(err)
                res.json({loggedIn: false, status: "Something went wrong"})
            })
            .then(token =>{
                res.json({loggedIn: true, token})
            })

        }
        else {
            res.json({loggedIn : false, status:"Wrong username or passsword."})
        }
    }
    else{
        res.json({loggedIn : false, status:"Wrong username or passsword."})
    }
}

module.exports.register = async (req, res) => {
    
    const existingUser = await pool.query(
        "SELECT email from users WHERE email=$1",
        [req.body.email]);

    if (existingUser.rowCount === 0){
        // register
        const hashedPass = await bcrypt.hash(req.body.password, 10); //10 sec timer for hackers to hash password (security feature)
        const newUserQuery = await pool.query(
            "INSERT INTO users(email, passhash) values ($1, $2) RETURNING id, email",
            [req.body.email, hashedPass]);

        jwtSign({
            email: req.body.email,
            id: newUserQuery.rows[0].id,
            userId: newUserQuery.rows[0].userId
        },process.env.JWT_SECRET,
        {expiresIn: "1min"},)
        .catch(err => {
            console.log(err)
            res.json({loggedIn: false, status: "Something went wrong"})
        })
        .then(token =>{
            res.json({loggedIn: true, token})
        })

        //res.json({loggedIn: true, email: req.body.email})
    }
    else{
        res.json({loggedIn:false, status: "Email already in use."})
    }

}