
/*
const webpack = require('webpack');
const dotenv = require('dotenv');
const env = dotenv.config({ path: './.env.local' }).parsed;
*/

export function getGoogleOAuthURL () {

    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    
    const options = {
        redirect_uri: 'http://localhost:4000/api/sessions/oauth/google',//process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL ,
        client_id: '452210237643-hmp7qdqtftopbcjfes5r90ltrti08qpg.apps.googleusercontent.com',//process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(" ")
    }

    const qs = new URLSearchParams(options)

    console.log(options)

    return `${rootUrl}?${qs.toString()}`

}