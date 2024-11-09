import request from '@/utils/request'

export function register(data) {
    return request({
        url: '/user/register',
        method: 'post',
        data
    })
}

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

export function recharge(data) {
    return request({
        url: `/user/recharge`,
        method: 'put',
        data
    })
}
