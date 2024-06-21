import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, vnode, container);
}

function mountChildren(vnode: any, container: any) {
  vnode.children.forEach((child) => {
    patch(child, container);
  });
}

function mountElement(vnode: any, container: any) {
  const el = (vnode.el = document.createElement(vnode.type));

  const { children } = vnode;

  const { props } = vnode;

  for (const key in props) {
    const value = props[key];
    el.setAttribute(key, value);
  }

  // childrens是string或者array

  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }

  container.appendChild(el);
}

function setupRenderEffect(instance, vnode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container);
  vnode.el = subTree.el;
}
