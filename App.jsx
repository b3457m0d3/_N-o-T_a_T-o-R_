import React from 'react';
import { createStore } from 'redux';
import classNames from 'classnames';
import PianoRoll from './PianoRoll.jsx';
import { addNote } from './action-creators';

const initialState = {
  notes: [
  ]
};

const actionProcessors = {
  'ADD_NOTE': (state, {tone, start, duration}) => { 
    return {
      ...state, 
      notes: state.notes.concat([{tone, start, duration}]) 
    }; 
  },
  'REMOVE_NOTE': (state, {beat, tone}) => { 
    return { 
      ...state, 
      notes: state.notes.filter((note) => !(note.start <= beat && (note.start + note.duration >= beat) && note.tone === tone))
    }; 
  },
};

function stateReducer(state = initialState, action) {
  console.log(action);
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