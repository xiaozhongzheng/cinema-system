import axios from 'axios'

import request from '@/utils/request'

function getFilmesByStatus(status){
    return request({
        url: `/film/list/${status}`
    })
}


function getRecentFilmImage(num){
    let res = axios.get(`/film/recent/${num}`)
    return res
}

function getFilmListByScore(num){
    // let res = axios.get(`/film/score`,{
    //     params: {
    //         num: num
    //     }
    // })
    // return res
    return request({
        url: '/film/score',
        params: {
            num: num
        }
    })
}


export function getById(id){
    let res = axios.get(`film/single/${id}`)
    return res
}


export function pageQueryFilmes(pageNo,pageSize,type,region,title){
    let res = axios.get(`film/page`,{
        params: {
            pageNo: pageNo,
            pageSize: pageSize,
            type: type,
            region: region,
            title: title
        }
    })
    return res
}


export default {
    getFilmesByStatus,
    getRecentFilmImage,
    getFilmListByScore
}