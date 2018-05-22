const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')
const multer = require('multer')
const fs = require('fs')

const authentication = require('./authentication')

const app = express()

app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(session({ secret: process.env.SESSION_SECRET }))

app.get('/static/styles.css', (req, res) => res.sendFile(path.join(__dirname, './static/styles.css')))
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

authentication.setup(app)
authentication.routes(app)

app.use('/contestant', express.static(path.join(__dirname, 'contestant_app')))

app.get('/api/tweets/', (req, res) => {
  req.twitterClient.get('statuses/home_timeline', (error, tweets, response) => {
    if(error) throw error
    console.log('[tweets]', tweets, response)
    res.json(tweets)
  })
})

const promisify = (callbackMethod, ...args) =>
  new Promise((resolve, reject) =>
    callbackMethod(...args, (error, data, response) => {
      if (error) {
        reject(error)

        return
      }

      resolve(data, response)
    })
  ) 

const upload = multer({dest: 'uploads/'})
app.post('/api/tweet', upload.single('screenshot'), (req, res) => {
  const image = fs.readFileSync(req.file.path)
  const statusText = req.body.status.substr(0, 280)

  // TODO make sure both image and status are present

  promisify(req.twitterClient.post.bind(req.twitterClient), 'media/upload', {media: image})
    .then((media, response) => {
      console.log('[tweeting][mediaupload]', media)

      return media
    })
    .then(media => {
      const status = {
        status: statusText,
        media_ids: media.media_id_string
      }

      return promisify(req.twitterClient.post.bind(req.twitterClient), 'statuses/update', status)
    })
    .then(() => {
      fs.unlinkSync(req.file.path)
      res.sendStatus(200)
    })
    .catch(error => {
      console.log('[tweeting][error]', error)
    })
})

const {PORT} = process.env
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
