import { extend } from "../shared";

// effect.ts
class ReactiveEffect {
  private _fn: any;
  deps: any[] = [];
  active = true;
  onStop: any;

  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }

  stop() {
    // remove effect
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
}

let activeEffect;
// target -> key -> effect
const targetMap = new Map();
export function track(target, key) {
  // traget 是对象， key是对象的属性
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  // 对象的属性对应的effects
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  if (!activeEffect) {
    return;
  }

  deps.add(activeEffect);
  // 相当于自己有自己班级的名单，stop的时候能够在名单里把自己删掉，名单是一个Set
  activeEffect.deps.push(deps);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let deps = depsMap.get(key);
  for (let effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);

  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
