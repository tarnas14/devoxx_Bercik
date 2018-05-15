const path = require('path')
const express = require('express')
const app = express()

app.use('/contestant', express.static(path.join(__dirname, 'contestant_app')))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
