import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import reduxReset from 'redux-reset';
import { Provider } from 'react-redux';

import reducer from './reducers';
import PianoRoll from './components/PianoRoll.jsx';
var compose = function () {
  var fns = arguments;

  return function (result) {
    for (var i = fns.length - 1; i > -1; i--) {
      result = fns[i].call(this, result);
    }

    return result;
  };
};
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
