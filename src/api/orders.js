import request from '@/utils/request'

export function pageQueryOrders(params){
    return request({
        url: '/orders/page',
        method: 'get',
        params
    })
}

export function saveOrders(data){
    return request({
        url: '/orders/save',
        method: 'post',
        data
    })
}

export function getOrdersList(){
    return request({
        url: '/orders/list',
        method: 'get',
    })
}

export function cancelOrders(id){
  return request({
      url:  `/orders/cancel/${id}`,
      method: 'put',
  })
}

export function getFilmBoxOfficeApi(){
  return request({
      url:  `/orders/film/box_office`,
      method: 'get',
  })
}

export function getMonthTicketApi(){
  return request({
      url:  `/orders/month/ticket`,
      method: 'get',
  })
}
