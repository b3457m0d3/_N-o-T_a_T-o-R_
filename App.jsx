import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import reduxReset from 'redux-reset';
import { Provider } from 'react-redux';

import reducer from './reducers';
import PianoRoll from './components/PianoRoll.jsx';
function compose(...fnArgs) {
  const [first, ...funcs] = fnArgs.reverse();
  return function(...args) {
    return funcs.reduce((res, fn) => fn(res), first(...args));
  };
}
const enHanceCreateStore = compose(
    //applyMiddleware(...),
    reduxReset()  // Will use 'RESET' as default action.type to trigger reset
  )(createStore);
const store = enHanceCreateStore(reducer);

function App() {
  return (
    <Provider store={store}>
      <PianoRoll/>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
