import { noteActionNames } from '../constants/note-action-names';


export function addNote(tone, start, duration) {
  return {
    type: noteActionNames.ADD_NOTE,
    note: {
      tone,
      start,
      duration
    }
  };
}

export function removeNotes(ids) {
  return {
    type: noteActionNames.REMOVE_NOTES,
    ids
  };
}

export function moveNotes(ids, beats, tones) {
  return {
    type: noteActionNames.MOVE_NOTES,
    ids,
    beats,
    tones
  };
}

/*ADDED BY B3457M0D3~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-~~~~~~~~~~~~~~~~^~*/

export function clearNotes() {
  return {
    type: noteActionNames.CLEAR_NOTES
  };
}
