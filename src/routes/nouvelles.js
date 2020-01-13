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
                res.status(200).send(rawdata)
            } catch (err) {
                console.error('Invalid JSON in file:', err)
                res.sendStatus(500)
            }
        }
    })
})

router.get('/:id', (req, res) => {

    fs.readFile('./src/assets/nouvelles.json', {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.error('Unable to read file')
            res.sendStatus(500)
        } else {
            try {
                let rawdata = JSON.parse(data)
                let idnouvelle = req.params.id
                let nouvelle = rawdata.find((item) => {
                    return item.id == idnouvelle
                })
                if (nouvelle) {
                    res.send(nouvelle)
                } else {
                    res.status(404).send('NOUVELLE NOT FOUND')
                }
            } catch (err) {
                res.sendStatus(500)
            }
        }
    })

})

router.post('/', (req, res) => {
    const postdata = req.body
    fs.readFile('./src/assets/nouvelles.json', {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.error('Unable to read file')
        } else {
            try {
                let rawdata = JSON.parse(data)
                rawdata.push(postdata) // insert post data
                let formatdata = JSON.stringify(rawdata, null, 2) // convert back to json
                fs.writeFile('./src/assets/nouvelles.json', formatdata, (err) => {
                    if (err) {
                        console.error('Unable to write in file', err)
                        res.sendStatus(500)
                    } else {
                        const resources = {
                            status: 'created',
                            location: 'http://localhost:8080/nouvelles/' + postdata.id
                        }
                        res.status(201).send(resources)
                    }
                })
            } catch (err) {
                console.error('Invalid JSON in file:', err)
                res.sendStatus(500)
            }
        }
    })
})

router.put('/', (req, res) => {
    res.status(405).send('METHOD NOT ALLOWED!')
})

router.put('/:id', (req, res) => {
    const updatedata = req.body

    fs.readFile('./src/assets/nouvelles.json', {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.error('Unable to read file')
            res.sendStatus(500)
        } else {
            try {
                let rawdata = JSON.parse(data)
                const idnouvelle = req.params.id
                const nouvelleindex = rawdata.findIndex((item) => {
                    return item.id == idnouvelle
                })
                if (nouvelleindex > -1) {
                    rawdata.splice(nouvelleindex, 1)
                    rawdata.push(updatedata)
                    let formatdata = JSON.stringify(rawdata, null, 2) // convert back to json
                    fs.writeFile('./src/assets/nouvelles.json', formatdata, (err) => {
                        if (err) {
                            console.error('Unable to write file', err)
                            res.sendStatus(500)
                        } else {
                            res.status(200).send('RESOURCE WAS UPDATE')
                        }
                    })
                } else {
                    res.status(404).send('NOUVELLE NOT FOUND')
                }
            } catch (err) {
                console.error('OOPS SOMETHING HAPPENED', err)
                res.sendStatus(500)
            }
        }
    })
})

router.delete('/', (req, res) => {
    res.status(405).send('METHOD NOT ALLOWED!')
})

router.delete('/:id', (req, res) => {
    fs.readFile('./src/assets/nouvelles.json', {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.error('Unable to read file')
            res.sendStatus(500)
        } else {
            try {
                let rawdata = JSON.parse(data)
                const idnouvelle = req.params.id
                const nouvelleindex = rawdata.findIndex((item) => {
                    return item.id == idnouvelle
                })
                if (nouvelleindex > -1) {
                    rawdata.splice(nouvelleindex, 1)
                    let formatdata = JSON.stringify(rawdata, null, 2) // convert back to json
                    fs.writeFile('./src/assets/nouvelles.json', formatdata, (err) => {
                        if (err) {
                            console.error('Unable to write file')
                            res.sendStatus(500)
                        } else {
                            res.send('RESOURCE WAS DELETE')
                        }
                    })
                } else {
                    res.status(404).send('NO SUCH NOUVELLE WITH THAT ID')
                }
            } catch (err) {
                console.error('Invalid JSON in file:', err)
                res.sendStatus(500)
            }
        }
    })
})

module.exports = router