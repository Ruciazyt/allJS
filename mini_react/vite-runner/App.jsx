import React from "./core/React.js";

let showbar = false;
const Counter = ({ num }) => {
  function handleClick() {
    showbar = !showbar;
    React.updater();
  }
  const Foo = () => {
    return (
      <div>
        foo
        <div>child1</div>
        <div>child2</div>
      </div>
    );
  };
  const foo = (
    <div>
      foo
      <div>child1</div>
      <div>child2</div>
    </div>
  );
  const bar = <div>bar</div>;

  return (
    <div>
      <div>{showbar ? bar : foo}</div>
      {showbar && bar}
      {/* <div>{showbar ? foo : bar}</div> */}
      <button onClick={handleClick}>button</button>
    </div>
  );
};

const CounterContainer = () => {
  return <Counter></Counter>;
};

function App() {
  return (
    <div>
      hi-mini-react
      <Counter num={10}></Counter>
    </div>
  );
}
export default App;
