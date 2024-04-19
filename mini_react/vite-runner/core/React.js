function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type: type,
    props: {
      ...props,
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

function updateProps(dom, nextProps, prevProps = {}) {
  // Object.keys(props).forEach((key) => {
  //   if (key !== "children") {
  //     if (key.startsWith("on")) {
  //       const eventName = key.slice(2).toLowerCase();
  //       dom.addEventListener(eventName, props[key]);
  //     } else {
  //       dom[key] = props[key];
  //     }
  //   }
  // });
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });

  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const eventName = key.slice(2).toLowerCase();
          dom.removeEventListener(eventName, prevProps[key]);
          dom.addEventListener(eventName, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
}

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    const isSameType = child && oldFiber && child.type === oldFiber.type;
    let newFiber = null;
    if (isSameType) {
      // 创建了一个fiber对象
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        child: null,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber,
      };
    } else {
      if (child) {
        // 创建了一个fiber对象
        newFiber = {
          type: child.type,
          props: child.props,
          parent: fiber,
          child: null,
          sibling: null,
          dom: null,
          effectTag: "placement",
        };
      }

      if (oldFiber) {
        deletions.push(oldFiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }

    if (newFiber) {
      prevChild = newFiber;
    }
  });

  while (oldFiber) {
    deletions.push(oldFiber);

    oldFiber = oldFiber.sibling;
  }
}

function createDom(fiber) {
  // 返回的是真实DOM
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode(fiber.props.nodeValue)
      : document.createElement(fiber.type);

  return dom;
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];

  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  // 1. 创建dom
  if (!fiber.dom) {
    // 其实是根据vdom创建真实的dom，除了第一个对象有真实的dom，之后的fiber其实都是最开始就是虚拟dom
    const dom = (fiber.dom = createDom(fiber));

    // 2. 处理Props
    updateProps(dom, fiber.props, {});
  }

  // 3. 转换链表，处理指针
  const children = fiber.props.children;

  reconcileChildren(fiber, children);
}

function performUnitOfWork(fiber) {
  const isFuncitonComponent = typeof fiber.type === "function";

  if (isFuncitonComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 4. 返回下一个任务
  if (fiber.child) return fiber.child;

  while (fiber) {
    if (fiber.sibling) return fiber.sibling;
    fiber = fiber.parent;
  }
}

function commitRoot() {
  deletions.forEach(commitDeletion);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  deletions = [];
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}

function commitWork(fiber) {
  if (!fiber) return;

  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate.props);
  } else if (fiber.effectTag === "placement") {
    if (fiber.dom) fiberParent.dom.append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

let nexWorkOfUnit = null;
function workloop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nexWorkOfUnit) {
    nexWorkOfUnit = performUnitOfWork(nexWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nexWorkOfUnit && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workloop);
}
// container是一个真实的dom
// 调用ReactDom.createRoot(document.querySelector("#root")).render(App);
/* 
    const ReactDom = {
      createRoot: (container) => {
        return {
            render: (App) => {
              React.render(App, container);
            },
          };
        },
      }
    };

    App是jsx经过vite转换后调用CreateElement成为一个对象vdom
    workUnit其实是一个fiber对象，包括一个真实的dom，一个指向父节点的指针，一个指向子节点的指针，一个指向兄弟节点的指针
    props中的chidren其实是虚拟vdom对象
  */
let wipRoot = null;
let currentRoot = null;
let deletions = [];
function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  };

  nexWorkOfUnit = wipRoot;
}

function updater() {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };

  nexWorkOfUnit = wipRoot;
}

requestIdleCallback(workloop);

const React = {
  createElement,
  render,
  updater,
};

export default React;
