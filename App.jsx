import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, combineReducers } from 'redux';
import { ReduxRouter, routerStateReducer, reduxReactRouter, push } from 'redux-router';
import reduxReset from 'redux-reset';
import { Provider, connect } from 'react-redux';
import { createHistory } from 'history';


import reducer from './reducers';
import PianoRoll from './components/PianoRoll.jsx';

@connect((state) => ({}))

const enHanceCreateStore = compose(reduxReset())(createStore);
const store = enHanceCreateStore(reducer, window.devToolsExtension && window.devToolsExtension());

function App() {
  return (
    <Provider store={store}>
      <PianoRoll/>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
