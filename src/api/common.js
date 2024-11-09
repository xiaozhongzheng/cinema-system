import request from '@/utils/request'

export function login(data) {
    return request({
        url: "/login",
        method: "post",
        data
    })
}

export function getUserInfo(roleId) {
    return request({
        url: `/info`,
        method: "get",
        params: {
            roleId: roleId
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

export function updatePassword(data) {
    return request({
        url: `/password`,
        method: 'put',
        data
    })
}

export function upload(data) {
    return request({
        url: `/upload`,
        method: 'post',
        data,
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })

}