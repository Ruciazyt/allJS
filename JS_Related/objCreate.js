const _objCreate = proto =>{
    if(typeof proto !== 'object' || proto === null) return
    const fn = function(){}
    fn.prototype = proto
    return new fn()
    // let a = new fn()
    // 那么 a.__proto__ = fn.prototype = proto 
}