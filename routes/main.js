const express = require('express'); 
const router = express.Router(); 
const authController = require('../controllers/auth');  
const homeController = require('../controllers/home'); 
const recipesController = require('../controllers/recipes'); 
const { ensureAuth, ensureGuest } = require('../middleware/auth'); 


//Main Routes 
router.get('/', homeController.getIndex); 
router.get('/profile', ensureAuth, recipesController.getProfile);
router.get("/favorites", ensureAuth, recipesController.getFavorites); 
router.get('/landing', homeController.getLanding);


router.get('/feed', ensureAuth, recipesController.getFeed); //specific to this social media app. Can Yeeeet with other apps. 

//Routes for user login/signup
router.get('/login', authController.getLogin); 
router.post('/login', authController.postLogin); 
router.get('/logout', authController.logout); 
router.get('/signup', authController.getSignup); 
router.post('/signup', authController.postSignup); 

module.exports = router


