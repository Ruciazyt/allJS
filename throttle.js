// 节流
// 一段时间内只执行一次
function throttle(fn, delay) {
    let timer
    return function () {
        if(timer) return
        timer = setTimeout(()=>{
            fn.apply(this, arguments)
            timer = null
        }, delay)
    }
}

function test(){
    let text = '正确'
    console.log(text)
}

let func = throttle(test, 2000)
func();
func();


