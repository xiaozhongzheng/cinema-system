
const filmTypeArr = ["动作", "动画", "喜剧", "犯罪", "爱情", "科幻","其他"];
const regionArr = ["内地", "香港", "台湾", "日本", "美国", "其他"];
const host = 'localhost'
// const host = '47.96.128.212'

const userRoleArr = ['','员工','管理员']
const buttonStatusArr = ['禁用','启用']
const rolePathArr = ['/user','/employee','/admin']
const payStatus = ['已取消','已支付','已完成']



// 导出变量
export default {
    host,
    filmTypeArr, // 影片的类型
    regionArr, // 放映的地区
    userRoleArr,
    buttonStatusArr,
    rolePathArr,
    payStatus
}
