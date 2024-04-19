import ReactDom from "./core/ReactDom.js";
import React from "./core/React.js";
import App from "./App.jsx";

// function component
ReactDom.createRoot(document.querySelector("#root")).render(<App></App>);


// jsx -> vite -> React -> createElement -> vnode(obj) -> render -> dom