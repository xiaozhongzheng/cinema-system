
import request from '@/utils/request'

export function getFilmesByStatus(status){
    return request({
        url: `/film/list/${status}`
    })
}


export function getRecentFilmImage(num){
    let res = axios.get(`/film/recent/${num}`)
    return res
}

export function getFilmListByScore(num){
    return request({
        url: '/film/score',
        params: {
            num: num
        }
    })
}


export function getFilmById(id){
    return request({
        url: `/film/single/${id}`,
        method: 'get'
    })
}


export function pageQueryFilm(params){
    return request({
        url: '/film/page',
        method: 'get',
        params
    })
}

export function addFilm(data){
    return request({
        url: '/film/save',
        method: 'post',
        data
    })
}
export function updateFilm(data){
    return request({
        url: '/film/edit',
        method: 'put',
        data
    })
}
export function deleteFilmById(id){
    return request({
        url: `/film/${id}`,
        method: 'delete',
        
    })
}

export default {
    getFilmesByStatus,
    getRecentFilmImage,
    getFilmListByScore
}