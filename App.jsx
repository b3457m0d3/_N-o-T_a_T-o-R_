import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose } from 'redux';
import reduxReset from 'redux-reset';
import { Provider } from 'react-redux';


import reducer from './reducers';
import PianoRoll from './components/PianoRoll.jsx';

const undoRedo = undoable(reducer);
const enHanceCreateStore = compose(
    reduxReset()  // Will use 'RESET' as default action.type to trigger reset
  )(createStore);
const store = enHanceCreateStore(undoRedo);

function App() {
  return (
    <Provider store={store}>
      <PianoRoll/>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
