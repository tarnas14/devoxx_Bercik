const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const authentication = require('./authentication')
const logger = require('morgan')

const app = express()

app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(session({ secret: process.env.SESSION_SECRET }))

authentication.setup(app)
authentication.routes(app)

app.use('/contestant', express.static(path.join(__dirname, 'contestant_app')))

const {PORT} = process.env
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
