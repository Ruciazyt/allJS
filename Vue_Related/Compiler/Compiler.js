const html = `
<div><span>hello_world</span></div>
`

// 编译器是干什么的？ => 将模板编译为渲染函数 即组件中的render()
render(){
    //return h('div', {id:'foo', class:cls})
    //等价于
    return {
        tag:'div',
        props:{
            id:'foo',
            class:cls
        }
    }
}
