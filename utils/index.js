export function createReducer(processors, initialState) {
  return (state = initialState, action) => {
    console.log(state);
    if (!processors[action.type]) {
      console.log(state);
      return state;
    }
    console.log(state);
    return processors[action.type](state, action);
  };
}
export function doRectanglesIntersect(r1, r2) {
  return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
}
