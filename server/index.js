const express = require("express")
const { Server } = require("socket.io")
//created app which enables HTTP requests
const app = express(); 
const session = require("express-session")



const redisStore = require('connect-redis').default;
const server = require("http").createServer(app);
//const getRedisClient = require("./redis")
const Redis = require("ioredis")

//const https = require('https')
//const fs = require('fs');
const helmet = require("helmet");
const cors  = require("cors");
const authRouter = require("./routers/authRouter")
require("dotenv").config()

const {googleOAuthHandler} = require("./controllers/OAuthController")



const io = new Server(server, {
    cors: {
        origin:"http://localhost:3000",
        credentials: "true",
    }
})

const redisClient = new Redis()//getRedisClient()

//console.log(redisClient)

//Created a server, this will allow for bi-directional communication
//between server and client


//if im using redis, the port will be 6379

//middle ware for security, sets various http headers to protect againsts well known
//web vulnerabilities 
app.use(helmet())

//specifies which origins are allowed to access server, prevents cross-site 
//request forgery
app.use(cors({
    origin: "http://localhost:3000",
    credentials:true,
}))

//allows parsing of json bodies
app.use(express.json())

//allows for cookies, saves user state, keeps people logged in

app.use(session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    store: new redisStore({client: redisClient}),
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.ENVIRONMENT === "production" ? "true" : "auto",
        httpOnly: true,
        expires:   1000 * 60 * 60 * 24 * 7,
        sameSite: "lax"//process.env.ENVIRONMENT === "production" ? "true" : "lax"
    }
}))


//handles routes
//THIS ROUTE TO THIS FOlder
app.use("/auth", authRouter);

app.get("/api/sessions/oauth/google", googleOAuthHandler)


//handles events when client connects (in login, file will ask to connect)
io.on("connection", socket => {

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    const notify = () => {
        socket.emit('redirect', {url} )
    }
});




//listens for requests to connect to server
server.listen(4000, ()=>{
    console.log("Server listening on port 4000");


})

/*
const httpsOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };


https.createServer(httpsOptions, app).listen(8443, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
*/