import React from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'

let UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }) => (
  <Button onClick={onUndo} {!canUndo?'disabled':''}>
    Undo
  </Button>
  <Button onClick={onRedo} {!canRedo?'disabled':''}>
    Redo
  </Button>
)

const mapStateToProps = (state) => {
  return {
    canUndo: state.notes.past.length > 0,
    canRedo: state.notes.future.length > 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUndo: () => dispatch({type:"UNDO"}),
    onRedo: () => dispatch({type:"REDO"})
  }
}

UndoRedo = connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo)

export default UndoRedo
