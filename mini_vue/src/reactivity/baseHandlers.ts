import { track, trigger } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v",
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(readonly = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !readonly;
    }
    const res = Reflect.get(target, key);
    if (!readonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}
export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  readonlyGet,
  set(target, key, value) {
    console.warn(`key: ${key} can not be set`);
    return true;
  },
};
