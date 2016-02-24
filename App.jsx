import React from 'react';
import { createStore } from 'redux';
import classNames from 'classnames';
import PianoRoll from './PianoRoll.jsx';
import { addNote } from './action-creators';

const initialState = {
  notes: [
    { tone: 55, duration: 2, start: 0 }
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
      notes: state.notes.filter((note, index) => ids.indexOf(index) === -1)
    }; 
  },
  'MOVE_NOTES' : (state, {ids, beats, tones}) => {
    return { 
      ...state, 
      notes: state.notes.map((note, index) => {
        if (ids.indexOf(index) === -1) {
          return note;
        }
        let newStart = note.start + beats;
        if (newStart < 0) {
          newStart = 0;
        }
        let newTone = note.tone + tones;
        if (newTone < 0) {
          newTone = 0;
        }
        return { 
          ...note, 
          tone: newTone, 
          start: newStart 
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