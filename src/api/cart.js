import request from '@/utils/request'

export function addCart(data){
    return request({
        url: `/cart/save`,
        method: 'post',
        data
    })
}