'use strict';

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
        el: null
    };
    return vnode;
}

const isObject = (val) => {
    return val !== null && typeof val === "object";
};

const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        const publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    },
    set({ _: instance }, key, value) {
        instance.setupState[key] = value;
        return true;
    },
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
    };
    return component;
}
function setupComponent(instance) {
    // initProps();
    // initSlots();
    // setupState();
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.vnode.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
    function handleSetupResult(instance, setupResult) {
        if (typeof setupResult === "object") {
            instance.setupState = setupResult;
        }
        finishComponentSetup(instance);
    }
    function finishComponentSetup(instance) {
        const Component = instance.type;
        if (Component.render) {
            instance.render = Component.render;
        }
    }
}

function render(vnode, container) {
    patch(vnode, container);
}
function patch(vnode, container) {
    if (typeof vnode.type === "string") {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function mountChildren(vnode, container) {
    vnode.children.forEach((child) => {
        patch(child, container);
    });
}
function mountElement(vnode, container) {
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
    }
    else if (Array.isArray(children)) {
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

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
