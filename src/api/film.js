import axios from 'axios'


export function getRecentFilmImage(num){
    let res = axios.get(`/film/recent/${num}`)
    return res
}

export function getFilmListByScore(num){
    let res = axios.get(`/film/score`,{
        params: {
            num: num
        }
    })
    return res
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
