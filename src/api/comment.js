import axios from 'axios'
import request from '@/utils/request'

export function addComment(data){
    return request({
        url: `/comment/save`,
        method: 'post',
        data
    })
}


export function getCommentByFilmId(id){
    return request({
        url: '/comment/get',
        method: 'get',
        params: {
            filmId: id
        }
    })
}
