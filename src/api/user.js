import request from '@/utils/request'
export function getUserById(id) {
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
