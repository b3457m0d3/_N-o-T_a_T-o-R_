import { actionNames } from '../constants/action-names';

export function addNote(tone, start, duration) {
  return {
    type: actionNames.ADD_NOTE,
    note: {
      tone, start, duration
    }
  };
}

export function removeNotes(ids) {
  return {
    type: actionNames.REMOVE_NOTES,
    ids
  };
}

export function moveNotes(ids, beats, tones) {
  return {
    type: actionNames.MOVE_NOTES,
    ids, beats, tones
  };
}

export function clearNotes() {
  return {
    type: actionNames.CLEAR_NOTES,
    null
  };
}

export function setEditMode(mode){
  return {
    type: actionNames.SET_EDIT_MODE,
    mode
  };
}
