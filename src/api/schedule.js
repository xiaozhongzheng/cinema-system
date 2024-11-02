import axios from 'axios'


export function addSchedule(data){
    let res = axios.post('/schedule/save',data)
    return res;
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