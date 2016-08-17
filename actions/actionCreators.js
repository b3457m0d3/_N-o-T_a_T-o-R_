import { actionNames } from '../constants/action-names';

export function addNote(tone, start, duration) {
  return {
    type: actionNames.ADD_NOTE,
    note: {
      tone,
      start,
      duration
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
    ids,
    beats,
    tones
  };
}
