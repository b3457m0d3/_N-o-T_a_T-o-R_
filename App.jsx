import React from 'react';
import { createStore } from 'redux';
import classNames from 'classnames';
import PianoRoll from './PianoRoll.jsx';
import { addNote } from './action-creators';

const initialState = {
  notes: [
    { start: 0, length: 2, tone: 10 }, 
    { start: 6, length: 1, tone: 5 }
  ]
};

const actionProcessors = {
  'ADD_NOTE': (state, {tone, start, length}) => { 
    return {
      ...state, 
      notes: state.notes.concat([{tone, start, length}]) 
    }; 
  },
  'REMOVE_NOTE': (state, {id}) => { 
    return { 
      ...state, 
      notes: state.notes.filter((note) => note.id !== id) 
    }; 
  },
};

function stateReducer(state = initialState, action) {
  if (!actionProcessors[action.type]) {
    return state;
  }
  return actionProcessors[action.type](state, action);
}

class App extends React.Component {
  constructor() {
    super();
    this.store = createStore(stateReducer);
    this.store.dispatch({type: 'DUMMY'});
  }
  render() {
    return (<PianoRoll store={this.store} width='600px' height='300px'/>)
  }
}

export default App;