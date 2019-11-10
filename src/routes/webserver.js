/* eslint-disable no-console */
'use strict'

const fs = require('fs')
let express = require('express')
// eslint-disable-next-line new-cap
let router = express.Router()

router.get('/', (req, res) => {
    fs.readFile('./src/assets/nouvelles.json', {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.error('Unable to read file:', err)
            res.sendStatus(500)
        } else {
            try {
                let rawdata = JSON.parse(data)
                res.status(200).render('index.html', {nouvelledatas: rawdata.nouvelles})
            } catch (err) {
                console.error('Invalid JSON in file:', err)
                res.sendStatus(500)
            }
        }
    })
})

router.get('/info', (req, res) => {
    res.send('jsau-webserver-1.0.0')
})

module.exports = router