// let a = {
//     val:1,
//     valueOf: function(){
//         return a.val++
//     }
// }
let a = {
    val:1,
    // valueOf: function(){
    //     return a.val
    // },
    toString: function(){
        return a.val++
    }
}

// 涉及到强制类型转换 - 你不知道的JS（中）第四章，先valueOf,再看有没有toString
if(a == 1 && a == 2 && a == 3){
    console.log("ok")
}