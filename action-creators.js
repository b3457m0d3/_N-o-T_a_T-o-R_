export function addNote(tone, start, duration) {
  return {
    type: 'ADD_NOTE',
    tone,
    start, 
    duration
  };
}

export function removeNotes(ids) {
  return {
    type: 'REMOVE_NOTES',
    ids
  };
}

export function moveNotes(ids, beats, tones) {
  return {
    type: 'MOVE_NOTES',
    ids,
    beats,
    tones
  }
}
