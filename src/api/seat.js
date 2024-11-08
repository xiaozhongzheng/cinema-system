
import request from '@/utils/request'


export function getSeatsByScheduleId(params){
    return request({
        url: '/seat/list',
        method: 'get',
        params
    })
}

export function deleteSeatById(params){
    return request({
        url: '/seat',
        method: 'delete',
        params
    })
}