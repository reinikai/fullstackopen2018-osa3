import axios from 'axios'
const baseUrl = '/api/persons'

const create = (newObject) => {
    return axios.post(baseUrl, newObject)
}

const read = () => {
    return axios.get(baseUrl)
}

const _delete = (id) => {
    return axios.delete(baseUrl + '/' + id)
}

export default { create, read, _delete }
