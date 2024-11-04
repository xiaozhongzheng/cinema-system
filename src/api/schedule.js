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
    let res = axios.get('/schedule/list/showDate',{
        params: {
            filmId: id
        }
    })
    return res;
}


export function getScheduleListByDate(date,id){
    let res = axios.get('/schedule/list/showBuy',{
        params: {
            time: date,
            filmId: id
        }
    })
    return res;
}