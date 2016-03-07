export function createReducer(processors, initialState) {
  return (state = initialState, action) => {
    console.log(action);
    if (!processors[action.type]) {
      return state;
    }
    return processors[action.type](state, action);
  };
}