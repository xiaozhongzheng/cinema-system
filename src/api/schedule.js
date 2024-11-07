import axios from 'axios'
import request from '@/utils/request'

export function addSchedule(data){
 
    return request({
        url: '/schedule/save',
        method: 'post',
        data
    })
}

export function updateSchedule(data){
 
    return request({
        url: '/schedule',
        method: 'put',
        data
    })
}

export function pageQuerySchedule(params){
 
    return request({
        url: '/schedule/page',
        method: 'get',
        params
    })
}




export function getScheduleDateList(id){
    return request({
        url: '/schedule/list/showDate',
        method: 'get',
        params: {
            filmId: id
        }
    })
}


export function getScheduleListByDate(date,id){
    return request({
        url: '/schedule/list/showBuy',
        method: 'get',
        params: {
            time: date,
            filmId: id
        }
    })
}