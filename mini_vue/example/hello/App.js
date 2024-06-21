import { h } from '../../lib/mini-vue.esm.js'
window.self = null
export const App = {
    render() {
        window.self = this
        return h('div', {
            id: 'root',
            class: ['red', 'hard']
        },
            // this需要获取到setup中的数据，也可以拿到$el, 使用了代理模式，都交给proxy处理
            'hi ' + this.msg
            // [h("p", { class: 'red' }, 'hi'), h("p", { class: 'hard' }, 'mini-vue')]
        )
    },
    setup() {
        return {
            msg: 'hi, mini-vue'
        }
    }
}