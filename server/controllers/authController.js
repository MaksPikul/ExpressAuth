const pool = require("../db");
const bcrypt = require("bcrypt");

module.exports.getLogin = (req, res) => {
    if (req.session.user && req.session.user.email){
        res.json({loggedIn: true, email: req.session.user.email})
    }
    else{
        res.json({loggedIn: false});
    }
}

module.exports.postLogin = async (req, res) => {
       
    const potentialLogin = await pool.query("SELECT id, email, passhash FROM users u WHERE u.email=$1", [req.body.email])

    if (potentialLogin.rowCount > 0){
        const samePass = bcrypt.compare
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
        req.session.user = {
            email: req.body.email,
            id: newUserQuery.rows[0].id
        }
        res.json({loggedIn: true, email: req.body.email})
    }
    else{
        res.json({loggedIn:false, status: "Email already in use."})
    }

}