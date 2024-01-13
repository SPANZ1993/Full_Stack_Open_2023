import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'


const getAll = (query) => {
    const request = axios.get(baseUrl.concat('/all'))
    return request.then(response => response.data)
}


export default {getAll}