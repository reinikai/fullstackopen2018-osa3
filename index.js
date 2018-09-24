const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

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

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-31337',
    },
    {
        id: 2,
        name: 'Pelle Peloton',
        number: '050-6047',
    },
    {
        id: 3,
        name: 'Niilo Nimetön',
        number: '044-123456',
    },
    {
        id: 4,
        name: 'Erkki Esimerkki',
        number: '041-654321',
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

function generateId(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (undefined === body.name) {
        return response.status(400).json({error: 'name missing'})
    }

    if (undefined === body.number) {
        return response.status(400).json({error: 'number missing'})
    }

    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({error: 'name already in db'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(1, 604731337)
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
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