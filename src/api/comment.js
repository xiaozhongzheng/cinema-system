import axios from 'axios'


export function addComment(data){
    let res = axios.post(`/comment/save`, data)
    
    return res;
}

export function getCommentByFilmId(id){
    let res = axios.get(`/comment/get`, {
        params: {
            filmId: id
        }
    })
    
    return res;
}
