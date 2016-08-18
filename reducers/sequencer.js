import constants from '../constants';
import { createReducer } from '../utils';

const { actionNames } = constants;

function setupSequencer(state, {config}){
  return Object.assign({},state,config);
}

function addNote(state, {note}) {
  return state.concat([note]);
}

function removeNotes(state, {ids}) {
  return state.filter((note, index) => ids.indexOf(index) === -1);
}

function moveNotes(state, {ids, beats, tones}) {
  return state.map((note, index) => {
    if (ids.indexOf(index) === -1) return note;
    let newStart = note.start + beats;
    if (newStart < 0) newStart = 0;
    let newTone = note.tone + tones;
    if (newTone < 0) newTone = 0;
    return {
      ...note,
      tone: newTone,
      start: newStart
    };
  });
}

const actionProcessors = {
  [actionNames.SETUP_SEQUENCER] : setupSequencer,
  [actionNames.ADD_NOTE]: addNote,
  [actionNames.REMOVE_NOTES]: removeNotes,
  [actionNames.MOVE_NOTES] : moveNotes
};

const initialState = [];

export default createReducer(actionProcessors, initialState);
