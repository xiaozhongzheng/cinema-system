

import request from '@/utils/request'


export function pageQueryScreen(params){
    return request({
        url: '/screen/page',
        method: 'get',
        params
    })
}

export function addScreen(data){
    return request({
        url: '/screen/save',
        method: 'post',
        data
    })
}

export function getScreenById(id){
    return request({
        url: `/screen/single/${id}`,
        method: 'get',
        
    })
}

export function updateScreen(data){
    return request({
        url: '/screen/edit',
        method: 'put',
        data
    })
}


export function deleteScreen(id){
    return request({
        url: `/screen/${id}`,
        method: 'delete',
        
    })
}


export function getScreenRoomList(){
    return request({
        url: '/screen/list',
        method: 'get'
    })
}