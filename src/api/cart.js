import request from '@/utils/request'

export function addCart(data){
    return request({
        url: `/cart/save`,
        method: 'post',
        data
    })
}

export function getCartes(){
    return request({
        url: `/cart/list`,
        method: 'get',
        
    })
}

export function deleteCartById(id){
    return request({
        url: `/cart/${id}`,
        method: 'delete',
        
    })
}