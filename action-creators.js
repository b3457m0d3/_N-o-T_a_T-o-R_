export function addNote(tone, start, length) {
  return {
    type: 'ADD_NOTE',
    tone,
    start, 
    length
  };
}

export function removeNote(id) {
  return {
    type: 'REMOVE_NOTE',
    id
  };
}
