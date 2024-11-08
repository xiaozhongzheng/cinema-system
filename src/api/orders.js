import request from '@/utils/request'

export function pageQueryOrders(params){
    return request({
        url: '/orders/page',
        method: 'get',
        params
    })
}

export function saveOrders(data){
    return request({
        url: '/orders/save',
        method: 'post',
        data
    })
}

export function getOrdersList(){
    return request({
        url: '/orders/list',
        method: 'get',
    })
}