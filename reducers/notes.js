import { noteActionNames } from '../constants/note-action-names';
import { createReducer } from '../utils';

function addNote(state, { note }) {
  return state.concat([note]);
}

function removeNotes(state, {ids}) {
  return state.filter((note, index) => ids.indexOf(index) === -1);
}

function moveNotes(state, {ids, beats, tones}) {
  return state.map((note, index) => {
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
  });
}

/*ADDED BY B3457M0D3~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-~~~~~~~~~~~~~~~~^~*/

function clearNotes(state,{}){
  return [];
}

                  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-~~~~~~~~~~~~~~~~^~*/

const actionProcessors = {
  [noteActionNames.ADD_NOTE]: addNote,
  [noteActionNames.REMOVE_NOTES]: removeNotes,
  [noteActionNames.MOVE_NOTES] : moveNotes,
  [noteActionNames.CLEAR_NOTES] : clearNotes //added by b3457m0d3
};

const initialState = [];

export default createReducer(actionProcessors, initialState);
