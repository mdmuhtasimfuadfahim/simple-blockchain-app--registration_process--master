require('dotenv').config()


const express = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const morgan = require('morgan')
const Emitter = require('events')

/*----------------define port number-------------------*/ 
const PORT = process.env.PORT || 4050

const session = require('express-session')
const flash = require('express-flash')
const MongoDBStore = require('connect-mongo')
const passport = require('passport')


/*--------------------log requests---------------------*/ 
app.use(morgan('tiny'))

/*----------------database connection------------------*/
const connectDB = require('./app/config/db')
const { connection } = require('mongoose')
connectDB()

/*------------------deploy contract---------------*/
// const deployment = require('./deployment')
// deployment()


/*------------------session store----------------------*/ 
const mongoDBStore = new MongoDBStore({
    mongoUrl: process.env.MONGO_CONNECTION_URL,
    dbName: "myDatabaseBlockchain",
    stringify: false
})

/*------------------event emitter----------------------*/
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

/*------------------session configuration--------------*/ 
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoDBStore,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 5} //5 hours
}))

/*-------------passport configuration-----------------*/
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session()) 

/*-----------------aeests-----------------------------*/
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false}))
app.use(express.json()) 

/*-----------------use flash--------------------------*/ 
app.use(flash())

/*------------------global middlewares----------------*/
app.use((req, res, next)=>{
    res.locals.user = req.user
    res.locals.session = req.session
    next()
})

/*----------------set template engine-----------------*/ 
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

/*-------------------routing controllers--------------*/ 
require('./routes/web')(app)


/*--------------------run server---------------------*/ 
app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`Listening on port ${PORT}`)
})

/*----------------------socket-----------------------*/
// const io = require('socket-io')(server)
// io.on('connection', (socket) =>{
//     // ---join
//     socket.on('join', (userID) =>{
//         socket.join(userID)
//     })
// })

// eventEmitter.on('userAdded', (data) =>{
//     io.to(`user_${data.id}`).emit('userAdded', data)
// })