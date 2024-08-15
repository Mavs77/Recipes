//Ensure this is at the top. ENsures that environment variables are loaded and available for use throughout your application. This ensures that all parts of your application have access to the necessary configuration values from the .env file.

require('dotenv').config({path: './config/.env'}); 

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session') //manage user sessions in an express.js application 
const MongoStore = require('connect-mongo') //store session data in a mongoDB database
const methodOverride = require('method-override')
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const recipeRoutes = require('./routes/recipe')

//ignore
const commentRoutes = require('./routes/comments')

const DB_STRING = process.env.DB_STRING


connectDB()

require('./config/passport')(passport)


// use EJS for views 
app.set('view engine', 'ejs')

//static folder 
app.use(express.static('public'))

//body parsing 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//logging 
app.use(logger('dev'))

//use forms for put / delete 
app.use(methodOverride("_method"));  

// Setup sessions - stored in MongoDB
app.use(
    session({
        secret: 'keyboard cat', 
        resave: false, 
        saveUninitialized: false, 
        store: MongoStore.create({ 
            mongoUrl: DB_STRING
        })
    })
)


// Passport middleware 
app.use(passport.initialize())
app.use(passport.session())

//Use flash messages for errors, info, etc...
app.use(flash())

//setup routes for which the server is listening 
app.use('/', mainRoutes)
app.use('/recipe', recipeRoutes)

//ignore
app.use('/comment', commentRoutes)
 
app.listen(process.env.PORT || 1993, ()=>{
    console.log('Server is running, game on!')
})

//test change 