
import axios from 'axios'


export function getScreenRoomList(){
    let res = axios.get(`/screen/list`)
    return res
}