import request from '@/utils/request'

export function getUserById(id) {
    return request({
        url: '/user/single',
        params: {
            id: id
        }
    })
}


export function updateUserById(id,data) {
    return request({
        url: `/user/${id}`,
        method: 'put',
        data
    })
}

