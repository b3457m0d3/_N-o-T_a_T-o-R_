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
      notes: state.notes.concat([{tone, start, duration }]) 
    }; 
  },
  'REMOVE_NOTES': (state, {ids}) => { 
    return { 
      ...state, 
      notes: state.notes.filter((note) => ids.indexOf(note.id) !== -1)
    }; 
  },
  'MOVE_NOTES' : (state, {ids, beatDistance, toneDistance}) => {
    return { 
      ...state, 
      notes: state.notes.map((note) => {
        if (ids.indexOf(note.id) === -1) {
          return note;
        }
        return { 
          ...note, 
          tone: note.tone + toneDistance, 
          start: note.start + beatDistance 
        };
      })
    };
  }
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
  }
  render() {
    return (<PianoRoll store={this.store} width='600px' height='300px'/>)
  }
}

export default App;