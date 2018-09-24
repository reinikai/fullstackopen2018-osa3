const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        JSON.stringify(req.body),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(result => {
            res.json(result)
            mongoose.connection.close()
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
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    Person
        .findById(id)
        .then(person => {
            response.json(person)
        })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)

    response.status(204).end()
})

app.get('/info', (req, res) => {
    const lkm = 'Luettelossa on ' + persons.length + ' henkilön tiedot.'
    const pvm = new Date()
    res.status(200).send('<p>' + lkm + '</p><p>' + pvm + '</p>')
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})