// 修改，使得循环正常
function loop() {
  for (var i = 0; i < 9; i++) {
    setTimeout(() => {
      console.log(i);
    });
  }
}

// 1
function loop_1() {
  for (let i = 0; i < 9; i++) {
    setTimeout(() => {
      console.log(i);
    });
  }
}

// 2
function loop_2() {
  for (var i = 0; i < 9; i++) {
    ((j) => {
      setTimeout(() => {
        console.log(j);
      });
    })(i);
  }
}

// 3
function loop_3() {
  for (var i = 0; i < 9; i++) {
    (function (j) {
      setTimeout(() => {
        console.log(j);
      });
    })(i);
  }
}
// loop();
// loop_1();
// loop_2();
loop_3();
