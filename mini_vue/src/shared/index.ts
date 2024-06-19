export function extend(effect, options) {
  Object.assign(effect, options);
}

export const isObject = (val) => {
  return val !== null && typeof val === "object";
};

export const hasChanged = (value, oldValue) => {
  return !Object.is(value, oldValue);
}