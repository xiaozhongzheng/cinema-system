
import axios from 'axios'
import request from '@/utils/request'
export function getUserById(id) {
    let res = axios.get(`/single`, {
        params: {
            id: id
        }
    })
    return res
}

export function logout(data) {
    return request({
        url: `/logout`,
        method: 'post',
        data
    })

}
