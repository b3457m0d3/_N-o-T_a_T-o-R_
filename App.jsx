import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createEnhancedStore from './store';
import reducer from './reducers';
import NotatorContainer from './components/NotatorContainer.jsx';

const store = createEnhancedStore(reducer, window.devToolsExtension && window.devToolsExtension());

function AppContainer() {
  return (
    <Provider store={store}>
      <NotatorContainer/>
    </Provider>
  );
}

ReactDOM.render(<AppContainer />, document.getElementById('app'));
