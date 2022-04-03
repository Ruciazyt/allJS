//使用Object.prototype.toString 实现

function type_of(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

let test1 = {},
  test2 = [],
  test3 = 1;
console.log(type_of(test1));
console.log(type_of(test2));
console.log(type_of(test3));
