const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(function (tokens, request, response) {
    return [
        tokens.method(request, response),
        JSON.stringify(request.body),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'), '-',
        tokens['response-time'](request, response), 'ms'
    ].join(' ')
}))

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(result => {
            response.json(result)
        })
        .catch(error => {
            response.status(400).send({ error: 'list failed' })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (undefined === body.name) {
        return response.status(400).json({error: 'name missing'})
    }

    if (undefined === body.number) {
        return response.status(400).json({error: 'number missing'})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => {
            response.status(400).send({ error: 'save failed' })
        })
})

app.get('/api/persons/:id', (request, response) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => {
            response.status(400).send({ error: 'malformatted id' })
        })
})

app.get('/info', (request, response) => {
    const lkm = 'Luettelossa on ' + persons.length + ' henkilön tiedot.'
    const pvm = new Date()
    response.status(200).send('<p>' + lkm + '</p><p>' + pvm + '</p>')
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})