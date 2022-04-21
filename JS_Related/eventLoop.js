// async function async1() {
//   console.log("2--async1 start");
//   await async2();
//   console.log("10--async1 end");
// }

// async function async2() {
//   console.log("3--async2");
// }

// console.log("1--script start");

// setTimeout(function () {
//   console.log("12--setTimeout");
// }, 0);

// async1();

// new Promise(function (resolve) {
//   console.log("4--Promise1");
//   resolve();
//   console.log("5--Promise new");
// }).then(function () {
//   console.log("11--Promise1");
// });

// new Promise(function (resolve) {
//   console.log("6--Promise Old");
//   resolve();
// }).then(console.log("7--old"));

// console.log("8--script end");

// process.nextTick(function () {
//   console.log("9--nextTick");
// });

new Promise(function (resolve) {
  console.log("4--Promise1");
  resolve();
  console.log("5--Promise new");
}).then(function () {
  console.log("11--Promise1");
});

new Promise(function (resolve) {
  console.log("6--Promise Old");
  resolve();
}).then(console.log("7--old")).then(()=>{
    console.log("after-11")
}).then(console.log("8--old"));
