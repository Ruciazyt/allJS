import { extend } from "../shared";

let activeEffect;
let shouldTrack;
// effect.ts
class ReactiveEffect {
  private _fn: any;
  deps: any[] = [];
  // active标记当前effect是否需要执行
  active = true;
  onStop: any;

  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run() {
    if (!this.active) {
      return this._fn();
    }

    activeEffect = this;
    shouldTrack = true;

    const result = this._fn();
    shouldTrack = false;
    return result;
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
  effect.deps.length = 0;
}

// target -> key -> effect
const targetMap = new Map();
export function track(target, key) {
  if (!isTracking()) return;
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

  trackEffects(deps);
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trackEffects(deps) {
  if (deps.has(activeEffect)) return;
  deps.add(activeEffect);
  // 相当于自己有自己班级的名单，stop的时候能够在名单里把自己删掉，名单是一个Set
  activeEffect.deps.push(deps);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let deps = depsMap.get(key);
  triggerEffects(deps);
}

export function triggerEffects(deps) {
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
