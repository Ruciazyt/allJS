Array.prototype._map = function (fn) {
  const len = this.length;
  let res = [];
  for (let i = 0; i < len; i++) {
    res.push(fn(this[i]));
  }
  return res;
};

let a = [1, 2, 3, 4];
console.log(a._map((i) => i * 2));
console.log(new Array(3).fill(0)._map(()=>new Array(3).fill(0)))