// 先看下bind原函数的用法
let foo = function(){
    console.log(this)
}

// let boo = foo.bind({content:'hello'})
// foo()
// boo()


// 实现bind
// bind是由函数调用的，在原型链上处理
// 函数通过bind将this绑定到参数上
// 简单版
Function.prototype.myBind = function(ctx, ...args){
    var fn = this;
    return function(...rest){
        return fn.apply(ctx, [...args, ...rest]);
    }
}

let boo = foo.myBind({content:'hello'})
foo()
boo()