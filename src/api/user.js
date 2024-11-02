
import axios from 'axios'

export function getUserById(id){
    let res = axios.get(`/single`,{
        params: {
            id: id
        }
    })
    return res
}