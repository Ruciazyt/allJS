/**(ECMA-262) callbackfn should be a function that accepts three arguments. map calls callbackfn once for
each element in the array, in ascending order, and constructs a new Array from the results.
callbackfn is called only for elements of the array which actually exist; it is not called for
missing elements of the array.

If a thisArg parameter is provided, it will be used as the this value for each invocation of
callbackfn. If it is not provided, undefined is used instead.

callbackfn is called with three arguments: the value of the element, the index of the element,
and the object being traversed.

map does not directly mutate the object on which it is called but the object may be mutated by
the calls to callbackfn.

The range of elements processed by map is set before the first call to callbackfn. Elements
which are appended to the array after the call to map begins will not be visited by callbackfn.
If existing elements of the array are changed, their value as passed to callbackfn will be the
value at the time map visits them; elements that are deleted after the call to map begins and
before being visited are not visited.*/

Array.prototype._map = function (fn, thisArg) {
  if (this === null) {
    throw new TypeError("Array.prototype.map called on null or undefined");
  }

  let O = Object(this);

  let len = O.length >>> 0;

  if (typeof fn !== "function") {
    throw new TypeError(fn + " is not a function");
  }

  let T = thisArg;
  let A = new Array(len);
  let k = 0;

  while (k < len) {
    let kValue;
    if (k in O) {
      kValue = O[k];
      A[k] = fn.call(T, kValue, k, O);
    }
    k++;
  }
  return A;
};

let a = [1, 2, 3, 4];
console.log(a._map((i) => i * 2));
console.log(new Array(3).fill(0)._map(() => new Array(3).fill(0)));
