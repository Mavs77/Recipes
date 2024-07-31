const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

//renders the login page if the user is not already authenticated. If the user is authenticated, they are redirected to the '/todos' page. 
exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('/profile')
    }
    res.render('login', {
      title: 'Login'
    })
  }
  
  //This block handles login form submission. Validates the input, autenticates the user using 'passport', and handles any errors. If authentication is successful, the user is logged in and redirected to the '/todos' page. 
exports.postLogin = (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('/login')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        req.flash('errors', info)
        return res.redirect('/login')
      }
      req.logIn(user, (err) => {
        if (err) { return next(err) }
        req.flash('success', { msg: 'Success! You are logged in.' })
        res.redirect(req.session.returnTo || '/profile')
      })
    })(req, res, next)
  }

 exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(errr); 
    }
    req.session.destroy((err) => {
      if (err) {
        console.log('Error: Failed to destroy the session during logout.', err); 
        return next(err); 
      }
      req.user = null; 
      res.redirect('/'); 
    })
  } )
 } 
  
  //renders the signup page if the user is not already authenticated. If the user is authenticated, they are redirected to the '/profile' page. 
exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect('/profile')
    }
    res.render('signup', {
      title: 'Create Account'
    })
  }
  
  //handles signup form submission. Validates the input, checks for existing users, creates a new user, and logs them in if successful. If there are validation errors or the user already exists, it redirects back to the singup page with error messages

  exports.postSignup = async (req, res, next) => {
    const validationErrors = [];
    
    // Validate inputs
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' });
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' });
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' });

    // If there are validation errors, redirect back with errors
    if (validationErrors.length) {
        req.flash('errors', validationErrors);
        return res.redirect('../signup');
    }

    // Normalize email
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false });

    try {
        // Check if a user with the same email or username already exists
        const existingUser = await User.findOne({
            $or: [
                { email: req.body.email },
                { userName: req.body.userName }
            ]
        }).exec();

        // If user exists, redirect with error
        if (existingUser) {
            req.flash('errors', { msg: 'Account with that email address or username already exists.' });
            return res.redirect('../signup');
        }

        // Create new user
        const user = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        });

        // Save new user to the database
        await user.save();

        // Log the user in
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Redirect to profile page
            res.redirect('/profile');
        });

    } catch (err) {
        // Handle any errors that occurred during the process
        return next(err);
    }
};




// exports.postSignup = (req, res, next) => {
//     const validationErrors = []
//     if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
//     if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
//     if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
  
//     if (validationErrors.length) {
//       req.flash('errors', validationErrors)
//       return res.redirect('../signup')
//     }
//     req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
//     const user = new User({
//       userName: req.body.userName,
//       email: req.body.email,
//       password: req.body.password
//     })
  
//     User.findOne({$or: [
//       {email: req.body.email},
//       {userName: req.body.userName}
//     ]}, (err, existingUser) => {
//       if (err) { return next(err) }
//       if (existingUser) {
//         req.flash('errors', { msg: 'Account with that email address or username already exists.' })
//         return res.redirect('../signup')
//       }
//       user.save((err) => {
//         if (err) { return next(err) }
//         req.logIn(user, (err) => {
//           if (err) {
//             return next(err)
//           }
//           res.redirect('/profile')
//         })
//       })
//     })
//   }