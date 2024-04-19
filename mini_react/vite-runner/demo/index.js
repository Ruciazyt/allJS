let taskId = 0;
function workloop(deadline) {
  taskId++;
  console.log(deadline.timeRemaining());

  let shouldYield = false;
  while (!shouldYield) {
    console.log(`taskId: ${taskId} run task`)
    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workloop);
}

requestIdleCallback(workloop);
