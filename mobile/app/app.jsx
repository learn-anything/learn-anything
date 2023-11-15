import { createSignal } from 'solid-js';
import { Component } from './component.jsx';

const App = () => {
  const [count, setCount] = createSignal(0);
  const increment = () => {
    setCount((c) => c + 1);
  };
  return (
    <>
      <actionbar title="Hello, SolidJS!"></actionbar>
      <stacklayout>
        <label>
          You have tapped {count()} time{count() === 1 ? '' : 's'}
        </label>
        {
          // use 'on:___' instead of 'on___' for event handlers
          // See https://github.com/SudoMaker/dominative-solid#event-handling for detail
        }
        <button class="-primary" on:tap={increment}>
          Tap me!
        </button>
        <Component count={count} />
      </stacklayout>
    </>
  );
};

export { App };
