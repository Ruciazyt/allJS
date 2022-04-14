function sleep(seconds) {
  return new Promise((resolve, reject) => {
      setTimeout(() =>{
        resolve()
      }, seconds * 1000);
  });
}

sleep(2).then(()=>{
    console.log("hello world")
})