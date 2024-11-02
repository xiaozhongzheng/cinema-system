import axios from 'axios'

export function updateEmployeeById(data){
    let res = axios.put(`/employee/edit`, data)
    return res;
}


export function getEmployeeById(id,path){
    let result = axios.get(`/employee/single/${id}`)
    
    return result;
}