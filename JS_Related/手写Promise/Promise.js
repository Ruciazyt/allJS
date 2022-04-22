// IIFE

(function (window) {
  const PENDING = "PENDING";
  const RESOLVED = "resolved";
  const REJECTED = "rejected";

  function Promise(executor) {
    this.status = PENDING;
    // 给promise对象指定一个用于存储结果的属性
    this.data = undefined;
    // 每个元素的结构：{onResolved(){}, onRejected(){}}
    this.callbacks = [];

    const resolve = (value) => {
      // 如果当前状态不是PENDING，直接结束
      if (this.status !== PENDING) {
        return;
      }
      // 将状态改为Resolved
      this.status = RESOLVED;

      // 保存value数据
      this.data = value;

      // 如果有待执行的callback函数，立即异步执行回调函数onResolved
      if (this.callbacks.length > 0) {
        setTimeout(() => {
          this.callbacks.forEach((callback) => {
            callback.onResolved(value);
          });
        });
      }
    };

    const reject = (reason) => {
      // 如果当前状态不是PENDING，直接结束
      if (this.status !== PENDING) {
        return;
      }
      // 将状态改为rejected
      this.status = REJECTED;

      // 保存value数据
      this.data = reason;

      // 如果有待执行的callback函数，立即异步执行回调函数onResolved
      if (this.callbacks.length > 0) {
        setTimeout(() => {
          this.callbacks.forEach((callback) => {
            callback.onRejected(reason);
          });
        });
      }
    };
    try {
      // 理解这个
      // 相当于new Promise(() => {}) 时候接收一个函数（executor）
      // 用户可能会指定两个值 executor = (a , b) => {}
      // 然后我们相当于在代码里将resolve， reject 赋值给这个a, b
      // 其实这种形式也是可以的 (a, b) => {a(xxx)} 这里的a其实就是resolve，会被我们的resolve替换掉（赋值）
      // console.log(executor);
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  // 原型方法
  // then() 方法返回一个 Promise (en-US)。它最多需要有两个参数：Promise 的成功和失败情况的回调函数。
  /*
    onFulfilled 可选
      当 Promise 变成接受状态（fulfilled）时调用的函数。该函数有一个参数，即接受的最终结果（the fulfillment  value）。
      如果该参数不是函数，则会在内部被替换为 (x) => x，即原样返回 promise 最终结果的函数
    onRejected 可选
      当 Promise 变成拒绝状态（rejected）时调用的函数。该函数有一个参数，即拒绝的原因（rejection reason）。  
      如果该参数不是函数，则会在内部被替换为一个 "Thrower" 函数 (it throws an error it received as argument)。
  */
  Promise.prototype.then = function (onResolved, onRejected) {
    onResolved =
      typeof onResolved === "function" ? onResolved : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const self = this;

    // 返回新的promise对象
    return new Promise((resolve, reject) => {
      //根据回调执行的结果 改变这个返回的promise的状态
      const handler = (callback) => {
        try {
          const result = callback(self.data);
          //对应情况3
          if (result instanceof Promise) {
            //   result.then(
            //     (value) => resolve(value),
            //     (reason) => reject(reason)
            //   );
            // 这句话可以这么理解： 现在result是个promise，那么.then能够接收到result这个promise执行的结果
            // 即result 中的data保存了这个结果，然后就像上面result = callback(self.data)那样
            // 传入的这个resolve能够获取到那个结果
            result.then(resolve, reject);
          } else {
            // 对应情况2
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      };

      // 当前状态还是PENDING，保存回调函数
      if (self.status === PENDING) {
        self.callbacks.push({
          onResolved(value) {
            handler(onResolved);
          },
          onRejected(reason) {
            handler(onRejected);
          },
        });
      } else if (self.status === RESOLVED) {
        // 如果.then的promise是resolved状态,那么执行onResolved回调，并且改变then返回的promise的状态
        setTimeout(() => {
          /*
            1. 如果抛出异常，return的promise就会失败，reason就是error
            2. 如果回调函数返回不是promise，return的promise就会成功，value就是这个返回的指
            3. 如果回调函数返回是promise，return的promise的结果就是这个promise的结果
            */
          handler(onResolved);
        });
      } else if (self.status === REJECTED) {
        // 如果.then的promise是rejected状态，那么执行onRejected回调， 并且改变then返回的promise的状态
        setTimeout(() => {
          handler(onRejected);
        });
      }
    });
  };

  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
  };

  // 函数对象方法

  // MDN ------Promise.resolve
  // Promise.resolve(value)方法返回一个以给定值解析后的Promise 对象。
  // 如果这个值是一个 promise ，那么将返回这个 promise ；
  // 如果这个值是thenable（即带有"then" 方法）， 返回的promise会“跟随”这个thenable的对象，采用它的最终状态；否则返回的promise将以此值完成。
  // 此函数将类promise对象的多层嵌套展平。
  Promise.resolve = function (value) {
    // 返回成功 / 失败的promise
    return new Promise((resolve, reject) => {
      // 参数是promise
      if (value instanceof Promise) {
        value.then(resolve, reject);
      } else {
        // 参数不是promise
        resolve(value);
      }
    });
  };
  //静态函数Promise.reject返回一个被拒绝的Promise对象。
  Promise.reject = function (reason) {
    // 返回一个失败的promise
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  };

  /*
  Promise.all() 方法接收一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入，
  并且只返回一个Promise实例， 那个输入的所有promise的resolve回调的结果是一个数组。
  ----返回值
  如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise。
  如果传入的参数不包含任何 promise，则返回一个异步完成（asynchronously resolved） Promise。注意：Google Chrome 58 在这种情况下返回一个已完成（already resolved）状态的 Promise。
  其它情况下返回一个处理中（pending）的Promise。这个返回的 promise 之后会在所有的 promise 都完成或有一个 promise 失败时异步地变为完成或失败。 见下方关于“Promise.all 的异步或同步”示例。返回值将会按照参数内的 promise 顺序排列，而不是由调用 promise 的完成顺序决定。
  
  */
  Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
      const res = new Array(promises.length);
      // 用来保存成功promise的数量
      let resolvedCount = 0;
      promises.forEach((promise, index) => {
        // 为什么要包一层，为了处理非promise的值
        // 多理解下Promise.resolve ===> 有点像包装，对于值，包装成promise， 对于promise，相当于是复制一个
        Promise.resolve(promise).then(
          (value) => {
            res[index] = value;
            resolvedCount++;
            // 如何判断全部成功了？
            if (resolvedCount === promises.length) {
              resolve(res);
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  };

  /*
  Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
  promise.race是根据状态改变的时间先后来判断的
  */
  Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
      promises.forEach((promise) => {
        Promise.resolve(promise).then(
          (value) => {
            resolve(value);
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    });
  };

  // 向外暴露
  window.Promise = Promise;
})(window);
