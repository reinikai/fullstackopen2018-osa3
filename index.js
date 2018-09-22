const express = require('express')
const app = express()

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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const lkm = 'Luettelossa on ' + persons.length + ' henkilön tiedot.'
    const pvm = new Date()
    res.status(200).send('<p>' + lkm + '</p><p>' + pvm + '</p>')
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})