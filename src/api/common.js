import axios from 'axios'

export function updatePassword(data){
    let res = axios.put(`/password`, data)
    return res;
}