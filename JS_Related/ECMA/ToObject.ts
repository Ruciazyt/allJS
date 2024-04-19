function _ToObject(argument: any): Object {
  if (argument === null || argument === undefined) {
    throw new TypeError("Cannot convert undefined or null to object");
  }
  return Object(argument);
}

try {
  console.log(_ToObject(null));
} catch (error: any) {
  console.log(error.message);
}

try {
  console.log(_ToObject(undefined));
} catch (error: any) {
  console.log(error.message);
}

console.log(_ToObject(1));
console.log(_ToObject("1"));
console.log(_ToObject([1, 2, 3]));
console.log(_ToObject({ a: 1, b: 2 }));
console.log(_ToObject(true));
console.log(_ToObject(Symbol("1")));