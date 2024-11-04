import request from '@/utils/request'
export function getUserById(id) {
    return request({
        url: '/user/single',
        params: {
            id: id
        }
    })
}


