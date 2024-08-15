require('dotenv').config();
const axios = require("axios")

async function googleOAuthHandler(req, res) {

    const code = req.query.code 

    const {id_token, access_token } = await getGoogleOAuthTokens(code)

    //verify jwt
    if (!googleUser.verified_email){
        return res.status(403).send('Google account not verified')
    }

    const googleUser = await getGoogleUser({id_token, access_token})
    //jwt.decode(id_token) 
    const user = await findAndUpdateUser(
        {email: googleUser.email}, 
        {email: googleUser.email,
        name: googleUser.name,
        pfp: googleUser.picture
        },
        {upset: true,
        new: true
        }
    ) 

    //create session
    req.session.user = {
        email: cachedAccount.email,
        id: newUserQuery.rows[0].id
    }

    //create access token sign JWT

    //create refresh token
    
    //set cookies

    res.redirect()//send to origin

}

async function getGoogleUser({id_token, access_token}) {

    try {
        const res = await axios.get(`https://www.googleapis.com/oauthv2/v1/userinfo?
        alt=json&access_token=${access_token}`, {
            headers:{
                Authorization: `Bearer ${id_token}`
            }
        })
        
        return res.data
    }
    catch (err) {
        console.log(err)
    }
}

export async function findAndUpdateUser({query, update, options = {}}) {

    const potentialLogin = await pool.query("SELECT id, email, passhash FROM users u WHERE u.email=$1", [req.body.email])

    // if no email, make a user

    return user
}

async function getGoogleOAuthTokens(code) {
    const url = 'https://oauth2.googleapis.com/token'

    const values = {
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_OAUTH_REDIRECT_URL,
        grant_type: "authorization_code"
    }

    try {
        const res = await axios.post(url, qs.stringify(values),{
            headers: {
                'content-type': 'application/x-www-form-urlencodded'
            },
        })
        return res.data
    }
    catch (err) {
        console.log(err, 'Failed to fetch Google OAuth')
        //throw new Error(err.message)
    }

}

module.exports = {getGoogleOAuthTokens, googleOAuthHandler}