function renderer(vnode, container) {
  if (typeof vnode.tag === "string") {
    mountElement(vnode, container);
  }else if(typeof vnode.tag === "object") {
    mountComponent(vnode, container);
  }
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag);
  // 处理props
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(key.substring(2).toLowerCase(), vnode.props[key]);
    }
  }
  if (typeof vnode.children === "string") {
    const text = document.createTextNode(vnode.children);
    el.appendChild(text);
  } else if (Array.isArray(vnode.children)) {
    // 递归
    vnode.children.forEach((child) => {
      renderer(child, el);
    });
  }
  container.appendChild(el);
}

function mountComponent(vnode, container){
    // vnode.tag其实就是虚拟Node
    const subTree = vnode.tag.render()
    renderer(subTree, container)
}   