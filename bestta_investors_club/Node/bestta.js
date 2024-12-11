const express = require('express')

const bodyParser = require('body-parser')

const path = require('path')
const https = require('https')
const fs = require('fs')
const cronJobs = require('./helpers/cron')
const app = express()

const db = require('./database/dbConfig')
app.use(express.json({ limit: '50mb' }))

const cors = require('cors')
require('dotenv').config()

app.use(cors())

app.use(express.static(__dirname + '/public/'))

app.all('/bestta-admin/', function (req, res) {
    res.status(200).sendFile(
        path.join(__dirname, 'public', 'bestta-admin', 'index.html')
    )
})
app.all('/bestta-admin/*', function (req, res) {
    res.status(200).sendFile(
        path.join(__dirname, 'public', 'bestta-admin', 'index.html')
    )
})

var httpsServer = https.createServer(
    {
        key: fs.readFileSync(
            '/etc/letsencrypt/live/indoredev.webmobrildemo.com/privkey.pem'
        ),
        cert: fs.readFileSync(
            '/etc/letsencrypt/live/indoredev.webmobrildemo.com/cert.pem'
        ),
        ca: [
            fs.readFileSync(
                '/etc/letsencrypt/live/indoredev.webmobrildemo.com/fullchain.pem'
            ),
        ],
    },
    app
)
httpsServer.listen(process.env.PORT, () => {
    console.log(
        `Server running on https://newlms.webmobril.com/:${process.env.PORT}`
    )
})

const { I18n } = require('i18n')

const i18n = new I18n({
    locales: ['en'],
    defaultLocale: 'en',
    directory: path.join('./', 'lang'),
})

app.use(i18n.init)
app.use('/public', express.static(path.join(__dirname, 'public')))
cronJobs.scheduleCronJob()
const JWTAuthantication = require('./middlewares/authentication')
app.use(JWTAuthantication)

const router = require('./routes/index')
app.use(router)

const admin = require('./routes/admin')
app.use('/admin', admin)

// app.listen(process.env.PORT, () => {
//     console.info('Server listening on port ' + process.env.PORT)
// })
