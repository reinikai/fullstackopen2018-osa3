import React from 'react'
import personService from './services/persons'
import './index.css'

const Notification = ({ message }) => {
    if (message === null) {
        return null
    }
    return (
        <div className="toast">
            {message}
        </div>
    )
}

const DeleteButton = ({handler}) => {
    return (
        <button onClick={handler}>Poista</button>
    )
}

const Person = (props) => {
    return (
        <tr><td>{props.person.name}</td><td>{props.person.number}</td><td><DeleteButton handler={props.handler}/></td></tr>
    )
}

const InputField = (props) => {
    return (
        <div>
            {props.name}: <input value={props.value} onChange={props.handler} />
        </div>
    )
}


class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            persons: [],
            newName: '',
            newNumber: '',
            toast: null
        }
    }

    componentDidMount() {
        this.read()
    }

    read() {
        personService
            .read()
            .then(response => {
                this.setState({persons: response.data})
            })
    }

    handleNameChange = (event) => {
        this.setState({ newName: event.target.value })
    }

    handleNumberChange = (event) => {
        this.setState({ newNumber: event.target.value })
    }

    handleDelete = (id) => {
        const name = this.state.persons.find(p => p.id === id).name

        if (window.confirm('Poistetaanko varmasti ' + name + '?')) {
            personService
                ._delete(id)
                .then(response => {
                    this.setState({toast: 'Poistettiin onnistuneesti'})
                    setTimeout(() => {
                        this.setState({toast: null})
                    }, 5000)
                    this.read()
                })
        }
    }

    addPerson = (event) => {
        event.preventDefault()

        const checkName = obj => obj.name === this.state.newName
        if (this.state.persons.some(checkName)) {
            alert('Nimi on jo luettelossa!')
            return false
        }

        const nameObject = {
            name: this.state.newName,
            number: this.state.newNumber
        }

        personService
            .create(nameObject)
            .then(response => {
                this.setState({
                    persons: this.state.persons.concat(response.data),
                    newName: '',
                    newNumber: '',
                    toast: 'Henkilö lisätty onnistuneesti!'
                })
                setTimeout(() => {
                    this.setState({toast: null})
                }, 5000)
            })
    }

    render() {
        return (
            <div>
                <h2>Puhelinluettelo</h2>
                <Notification message={this.state.toast}/>

                <form onSubmit={this.addPerson}>
                    <InputField name="nimi" value={this.state.newName} handler={this.handleNameChange}/>
                    <InputField name="numero" value={this.state.newNumber} handler={this.handleNumberChange}/>
                    <div>
                        <button type="submit">lisää</button>
                    </div>
                </form>
                <h2>Numerot</h2>
                <table>
                    <tbody>
                        {this.state.persons.map(person => <Person key={person.name} person={person} handler={() => this.handleDelete(person.id)} />)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default App

