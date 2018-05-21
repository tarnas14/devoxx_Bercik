const passport = require('passport')
const TwitterStrategy = require('passport-twitter')

const myAmazingDb = new Map() 

module.exports = {
  routes: (app) => {
    app.get('/auth/login', (req, res) => res.redirect('/auth/twitter'))
    app.get('/auth/twitter', passport.authenticate('twitter'))
    app.get('/auth/twitter/callback', passport.authenticate('twitter'), (req, res) => res.redirect('/contestant'))
  },
  setup: (app) => {
    // -- Setting up Passport --
    passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: `http://localhost:${process.env.PORT}/auth/twitter/callback`
      },
      (token, tokenSecret, profile, cb) => {
        console.log('[auth][twitter] authenticated twitter user', token, tokenSecret)
        console.log('[auth][twitter]', profile)

        myAmazingDb.set(profile.id, {profile, creds: {token, tokenSecret}})

        return cb(null, myAmazingDb.get(profile.id))
      }
    ))

    passport.serializeUser((userData, done) => done(null, userData.profile.id))
    passport.deserializeUser((id, done) => done(null, myAmazingDb.get(id)))

    app.use(passport.initialize())
    app.use(passport.session())

    // -- Setting up middleware for all views of the website --
    app.use((req, res, next) => {
      // Whitelist
      if (req.path.startsWith('/auth')) {
        next()
        return
      }

      if (!req.isAuthenticated || !req.isAuthenticated()) {
        res.redirect('/auth/login')
        return
      }

      next()
    })
  },
}
