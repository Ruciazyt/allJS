import { isObject } from "../shared/index";
import { track, trigger } from "./effect";
import { ReactiveFlags, reactive, readonly } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

function createGetter(isReadonly = false, shallowReadonly = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (key === ReactiveFlags.IS_SHALLOW_READONLY){
      return shallowReadonly;
    }
    // reflect.get只是用函数来获取值
    const res = Reflect.get(target, key);

    if(shallowReadonly) return res;

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    if (!isReadonly) {
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
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key: ${key} can not be set`);
    return true;
  },
};

export const shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target, key, value) {
    console.warn(`key: ${key} can not be set`);
    return true;
  },
};
