import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import PianoRoll from './components/PianoRoll.jsx';
import reducer from './reducers';

const store = createStore(reducer);

function App() {
  return (
    <Provider store={store}>
      <PianoRoll width='600px' height='300px'/>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
