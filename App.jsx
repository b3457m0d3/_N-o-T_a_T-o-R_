import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import reduxReset from 'redux-reset';
import { Provider } from 'react-redux';
import undoable, { distinctState } from 'redux-undo';

import reducer from './reducers';
import PianoRoll from './components/PianoRoll.jsx';

const undoableReducer = undoable(reducer, { filter: distinctState() });
const enHanceCreateStore = compose(reduxReset())(createStore);
const store = enHanceCreateStore(undoableReducer, window.devToolsExtension && window.devToolsExtension());

function App() {
  return (
    <Provider store={store}>
      <PianoRoll/>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
