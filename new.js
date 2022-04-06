// 实现new的过程
function myNew(constructor, ...args) {
    // 1.创建一个新对象
    const obj = {}
    // 2.绑定原型链
    obj.__proto__ = constructor.prototype
    // 3.执行构造函数，绑定this,传入参数
    const res = constructor.apply(obj, args)
    return res instanceof Object ? res : obj
}

function test(){
    
}

console.log()