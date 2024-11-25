// 里面存放着一些对项目进行优化的方法

/**
 * 防抖
 * @param {*} fn 表示事件处理函数
 * @param {*} delay 表示延迟的时间
 */
export function debounce(fn, delay) {
    let timer = null
    return function () {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(fn, delay)
    }
}

/**
 * 节流
 * @param {*} fn 表示事件处理函数
 * @param {*} time 表示间隔的时间
 */
export function throttle(fn, time) {
    let valid = true

    return function () {
        if (!valid) {
            return
        }
        valid = false
        setTimeout(function () {
            fn()
            valid = true
        }, time)
    }
}


