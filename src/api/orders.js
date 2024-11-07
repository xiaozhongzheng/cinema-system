import request from '@/utils/request'

export function pageQueryOrders(params){
    return request({
        url: '/orders/page',
        method: 'get',
        params
    })
}