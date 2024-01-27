const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const exphbs = require('express-handlebars')


//Load config
dotenv.config({
    path:'./config/config.env'
})

//passport config
require('./config/passport.js')(passport)

connectDB()


const app= express();

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//logging 
if(process.env.NODE_ENV ==='devlopment'){
    app.use(morgan('dev'))
}

//handlebars
// Example of setting up exphbs with Express
app.engine('.hbs', exphbs.engine({ defaultLayout:'main',extname: '.hbs' }));
app.set('view engine', '.hbs');

//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI,}),
  }))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname,'public')))

//routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))
