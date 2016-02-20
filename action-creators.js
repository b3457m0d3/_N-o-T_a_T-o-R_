export function addNote(tone, start, duration) {
  return {
    type: 'ADD_NOTE',
    tone,
    start, 
    duration
  };
}

export function removeNote(beat, tone) {
  return {
    type: 'REMOVE_NOTE',
    beat,
    tone
  };
}
