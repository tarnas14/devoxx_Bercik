const passport = require('passport')
const TwitterStrategy = require('passport-twitter')
const Twitter = require('twitter')

const userProfiles = new Map() 
const credentials = new Map()

module.exports = {
  routes: (app) => {
    app.get('/auth/login', passport.authenticate('twitter'))
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/auth/login' }), (req, res) => res.redirect('/contestant'))
  },
  setup: (app) => {
    // -- Setting up Passport --
    passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK
      },
      (token, tokenSecret, profile, cb) => {
        console.log('[auth][twitter] authenticated twitter user', token, tokenSecret)
        console.log('[auth][twitter]', profile)

        userProfiles.set(profile.id, profile)
        credentials.set(profile.id, {token, tokenSecret})

        return cb(null, profile)
      }
    ))

    passport.serializeUser((userData, done) => done(null, userData.id))
    passport.deserializeUser((id, done) => done(null, userProfiles.get(id)))

    app.use(passport.initialize())
    app.use(passport.session())

    // -- Setting up middleware for all views of the website --
    app.use((req, res, next) => {
      // Whitelist
      if (req.path.startsWith('/auth') || req.path.startsWith('/static')) {
        next()
        return
      }

      if (!req.isAuthenticated || !req.isAuthenticated()) {
        res.redirect('/')
        return
      }

      const {token, tokenSecret} = credentials.get(req.user.id)
      req.twitterClient = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: token,
        access_token_secret: tokenSecret,
      })
      next()
    })
  },
}
