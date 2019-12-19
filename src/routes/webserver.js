/* eslint-disable no-console */
'use strict'

const fs = require('fs')
const jsaunewsutils = require('jsau-news-util')

let express = require('express')
// eslint-disable-next-line new-cap
let router = express.Router()


// Index, page d'accueil, on propose
// le formulaire de création de nouvelle
// et la liste des nouvelles dans un tableau
router.get('/', (req, res) => {
    fs.readFile('./src/assets/nouvelles.json', {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.error('Unable to read file:', err)
            res.sendStatus(500)
        } else {
            try {
                let rawdata = JSON.parse(data)
                res.status(200).render('index.njk', {nouvelledatas: rawdata, categories: jsaunewsutils.newsCategories})
            } catch (err) {
                console.error('Invalid JSON in file:', err)
                res.sendStatus(500)
            }
        }
    })
})
// Info
router.get('/info', (req, res) => {
    res.send('jsau-webserver-1.0.0')
})
// insertion d'une nouvelle dans le fichier JSON
router.post('/', (req, res) => {
    let postdata = req.body
    console.log(postdata)
    fs.readFile('./src/assets/nouvelles.json', {encoding: 'utf8'}, (err, data) => {
        if (err) {
            console.error('Unable to read file')
        } else {
            try {
                let rawdata = JSON.parse(data)
                let newid = rawdata.length + 1
                let newobject = {
                    id: newid,
                    title: postdata.title,
                    category: postdata.category,
                    content: postdata.content,
                    author: postdata.author
                }
                try {
                    let test = jsaunewsutils.validateData(postdata.category)
                    if (test) {
                        rawdata.push(newobject) // insert post data
                        let formatdata = JSON.stringify(rawdata, null, 2) // convert back to json
                        fs.writeFile('./src/assets/nouvelles.json', formatdata, (err) => {
                            if (err) {
                                console.error('Unable to write in file', err)
                                res.sendStatus(500)
                            } else {
                                res.status(201).redirect('/success/1')
                            }
                        })
                    }
                } catch (err) {
                    res.status(404).send(err)
                }
            } catch (err) {
                console.error('Invalid JSON in file:', err)
                res.sendStatus(500)
            }
        }
    })

})
// On gère ici les trois type de succès
// 1 pour l'ajout d'une nouvelle
// 2 pour la modification d'une nouvelle
// 3 pour le succès qui correspond à else
router.get('/success/:nb', (req, res) => {
    if (req.params.nb == 1) {
        res.status(200).render('success.njk', {message: 'Nouvelle ajoutée avec succès'})
    } else if (req.params.nb == 2) {
        res.status(200).render('success.njk', {message: 'Modifiations enregistrées avec succès'})
    } else if (req.params.nb == 3) {
        res.status(200).render('success.njk', {message: 'Erreur de catégorie'})
    } else {
        res.status(200).render('success.njk', {message: 'Nouvelle supprimée avec succès'})
    }
})
// Rendu pré-mise à jour d'une ressource
// on renvoi la ressource dans une form
// avec la possibilité de modification des champs
router.get('/edit/:id', (req, res) => {

    fs.readFile('./src/assets/nouvelles.json', {encoding: 'utf8'}, (err, data) => {
        if (err) {
            res.sendStatus(500)
        } else {
            try {
                let rawdata = JSON.parse(data)
                let idnouvelle = req.params.id
                let nouvelle = rawdata.find((item) => {
                    return item.id == idnouvelle
                })
                if (nouvelle) {
                    res.status(200).render('edit.njk', {nouvelledatas: nouvelle})
                } else {
                    res.status(404).send('NOUVELLE NOT FOUND')
                }
            } catch (err) {
                res.sendStatus(500)
            }
        }
    })
})
// Suppression d'une ressource
router.get('/delete/:id', (req, res) => {

    fs.readFile('./src/assets/nouvelles.json', {encoding: 'utf8'}, (err, data) => {
        if (err) {
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
                            res.status(201).redirect('/success/4')
                        }
                    })
                } else {
                    res.status(404).send('NO SUCH NOUVELLE WITH THAT ID')
                }
            } catch (err) {
                res.sendStatus(500)
            }
        }
    })
})
// Mise à jour proprement dit  d'une ressource
router.post('/updatenew', (req, res) => {
    let updatedata = req.body
    console.log(updatedata)
    fs.readFile('./src/assets/nouvelles.json', {encoding: 'utf8'}, (err, data) => {
        if (err) {
            res.sendStatus(500)
        } else {
            try {
                let rawdata = JSON.parse(data)
                const idnouvelle = updatedata.id
                const nouvelleindex = rawdata.findIndex((item) => {
                    return item.id == idnouvelle
                })
                if (nouvelleindex > -1) {
                    rawdata.splice(nouvelleindex, 1)
                    let newobject = {
                        id: updatedata.id,
                        title: updatedata.title,
                        content: updatedata.content,
                        author: updatedata.author
                    }
                    rawdata.push(newobject)
                    let formatdata = JSON.stringify(rawdata, null, 2) // convert back to json
                    fs.writeFile('./src/assets/nouvelles.json', formatdata, (err) => {
                        if (err) {
                            console.error('Unable to write file', err)
                            res.sendStatus(500)
                        } else {
                            res.status(201).redirect('/success/2')
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


module.exports = router