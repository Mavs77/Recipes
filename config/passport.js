const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')


module.exports = function (passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      // Convert email to lowercase for consistent comparison
      const user = await User.findOne({ email: email.toLowerCase() }).exec()
      if (!user) {
        return done(null, false, { msg: `Email ${email} not found.` })
      }
      if (!user.password) {
        return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' })
      }
      
      // Compare password using the user model's instance method
      const isMatch = await user.comparePassword(password)
      if (isMatch) {
        return done(null, user)
      } else {
        return done(null, false, { msg: 'Invalid email or password.' })
      }
    } catch (err) {
      return done(err)
    }
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).exec()
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
}