const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const authentication = require('./authentication')
const logger = require('morgan')
const Twitter = require('twitter')

const app = express()

app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(session({ secret: process.env.SESSION_SECRET }))

authentication.setup(app)
authentication.routes(app)

app.use('/contestant', express.static(path.join(__dirname, 'contestant_app')))

app.get('/api/tweets/', (req, res) => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: req.user.creds.token,
    access_token_secret: req.user.creds.tokenSecret,
  })

  client.get('statuses/home_timeline', (error, tweets, response) => {
    if(error) throw error;
    console.log('[tweets]', tweets, response)
    res.json(tweets)
  });
})

const {PORT} = process.env
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
