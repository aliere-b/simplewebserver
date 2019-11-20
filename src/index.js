'use strict'

let express = require('express')
const morgan = require('morgan')
let nunjucks = require('nunjucks')
const bodyParser = require('body-parser')

let app = express()
app.use(morgan('dev'))

nunjucks.configure('./src/assets', {
    express: app,
    autoescape: true
})

// parse requests of content-type - application/json
app.use(bodyParser.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

let nouvellesroute = require('./routes/nouvelles')
let webserverroute = require('./routes/webserver')

app.use('/', webserverroute)
app.use('/nouvelles', nouvellesroute)

app.listen(8081)