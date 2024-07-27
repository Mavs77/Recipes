require('dotenv').config({path: './config/.env'}); //Ensure this is at the top. ENsures that environment variables are loaded and available for use throughout your application. This ensures that all parts of your application have access to the necessary configuration values from the .env file.

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session') //manage user sessions in an express.js application 
const MongoStore = require('connect-mongo') //store session data in a mongoDB database
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const postRoutes = require('./routes/posts')

const DB_STRING = process.env.DB_STRING


connectDB()

require('./config/passport')(passport)



app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))

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

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


app.use('/', homeRoutes)
app.use('/todos', todoRoutes)
 
app.listen(process.env.PORT || 2930, ()=>{
    console.log('Server is running, you better catch it!')
})    