import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  IS_SHALLOW_READONLY = "__v_isShallowReadonly",
}
export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers);
}

export function isReactive(object) {
  return !!object[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(object) {
  return !!object[ReactiveFlags.IS_READONLY];
}

export function isShallowReadonly(object) {
  return !!object[ReactiveFlags.IS_SHALLOW_READONLY]
}

export function isProxy(object) {
  return isReactive(object) || isReadonly(object) || isShallowReadonly(object);
}

function createReactiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

