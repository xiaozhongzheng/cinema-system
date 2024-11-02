
import axios from 'axios'
import request from '@/utils/request'
export function getUserById(id) {
    // let res = request.get(`/single`, {
    //     params: {
    //         id: id
    //     }
    // })
    return request({
        url: '/single',
        params: {
            id: id
        }
    })
}

export function logout(data) {
    return request({
        url: `/logout`,
        method: 'post',
        data
    })

}
