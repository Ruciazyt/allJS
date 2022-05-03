const bucket = new WeakMap();

const data = {
  text: "hello world",
};

// 全局变量存储被注册的副作用函数
let activeEffect;
// effect函数用于注册副作用函数
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn
    fn()
  }
  effectFn.deps = []
  effectFn()
}
// 相当于我们的副作用函数中记录了自己属于哪个Set， 方向获取Set后操作Set删除当前副作用函数
function cleanup(effectFn) {
  for(let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    trigger(target, key);
  },
});

function track(target, key) {
  // bucket是主容器，存 对象-对象中属性包含的副作用的map
  // depsMap是某个对象---->如data对象相关的map
  let depsMap = bucket.get(target);
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  // 具体到data对象中某个值对应的副作用函数集合，deps本身是一个Set，
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
  activeEffect.deps.push(deps);
}

function trigger(target, key) {
  if (!activeEffect) return;
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);

  const effectsToRun = new Set(effects)
  effectsToRun.forEach((effect) => effect());
}

effect(() => {
  console.log("执行一次");
  // console.log(obj.text)
  document.body.innerText = obj.text;
});
setTimeout(() => {
  obj.text = "hello world2";
}, 1000);
