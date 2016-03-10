import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from './reducers';
import PianoRoll from './components/PianoRoll.jsx';

const store = createStore(reducer);

function App() {
  return (
    <Provider store={store}>
      <PianoRoll/>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
