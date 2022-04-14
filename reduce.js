// reduce实现
Array.prototype._reduce = function(fn, prev){
    let len = this.length
    for(let i = 0; i < len; i++){
        if(prev === undefined){
            prev = fn(this[i], this[i + 1])
            i++
        }else{
            prev = fn(prev, this[i])
        }
    }
    return prev
}


let a = [1,2,3,4]
console.log(a._reduce((a, b) => a + b, 0))