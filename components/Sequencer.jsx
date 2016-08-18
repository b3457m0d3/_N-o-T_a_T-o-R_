import React from 'react';
import { Button, ButtonGroup, Glyphicon, ButtonToolbar } from 'react-bootstrap';

import { doRectanglesIntersect } from '../utils';
import actions from '../actions';
import actionNames from '../constants/action-names.js';
import config from '../constants/config.js';
import SequencerItem from './SequencerItem.jsx';
import SequencerSelection from './SequencerSelection.jsx';
import SequencerGridDropdown from './SequencerGridDropdown.jsx';

import './styles/Sequencer.css';

const { addNote, removeNotes, moveNotes, clearNotes } = actions;



class Sequencer extends React.Component {
  constructor() {
    super();
    this.updateNotes = this.updateNotes.bind(this);
    this.onClearNotes = this.onClearNotes.bind(this);
    this.getGridPosition = this.getGridPosition.bind(this);
    this.noteDragMouseUp = this.noteDragMouseUp.bind(this);
    this.noteDragMouseMove= this.noteDragMouseMove.bind(this);
    this.isClickOutOfSequencer = this.isClickOutOfSequencer.bind(this);
    this.getNoteByCoordinates = this.getNoteByCoordinates.bind(this);
    this.calculateDragDistance = this.calculateDragDistance.bind(this);
    this.getItemRectangle = this.getItemRectangle.bind(this);
  }
  componentWillMount() {
    this.context.dispatch({
      type: actionNames.SEQUENCER_SETUP,
      {
        drag: config.defaultDrag,
        displayedItems: [],
        editMode: config.editModes.draw,
        drawItem: config.defaultDrawNote,
        selectedItems: [],
        selection: config.defaultSelection,
        gridSize: config.defaultGridSize
      }
    });
    const trackCountArray = Array.apply(null, {length: this.props.trackCount}).map(Number.call, Number).reverse();
    this.trackLanes = trackCountArray.map(this.props.getTrackLane);
    this.trackEntries = trackCountArray.map(this.props.getTrackEntry);
    this.noteMapper = this.noteMapper.bind(this);
    document.onselectstart = () => false;
    document.ondragstart = () => false;
  }
  componentDidMount() {
    const { store } = this.context;
    store.subscribe(this.updateNotes);
    this.getItems = () => store.getState().notes;
    this.unsubscribe = () => store.unsubscribe();

    this.sequencer.onscroll = () => {
      this.trackList.style.top = (-this.sequencer.scrollTop) + 'px';
    };
    this.sequencer.onselectstart = () => false;
    this.sequencer.ondragstart = () => false;
    this.updateNotes();
  }
  componentWillUnmount() { this.unsubscribe(); }
  getItemRectangle(note) {
    return {
      left: note.start * this.props.beatWidth,
      top: (this.props.trackCount - note.tone) * this.props.trackHeight,
      right: (note.start + note.duration) * this.props.beatWidth,
      bottom: (this.props.trackCount - note.tone) * this.props.trackHeight + this.props.trackHeight
    };
  }
  isClickOutOfSequencer(pageX, pageY) {
    return (pageX >= this.sequencer.offsetLeft + this.sequencer.offsetWidth - 20 ||
        pageY >= this.sequencer.offsetTop + this.sequencer.offsetHeight - 20);
  }
  noteMapper(note, i) {
    return <SequencerItem key={i}
    left={ note.start*this.props.beatWidth }
    top={ (this.props.trackCount - note.tone) * this.props.trackHeight }
    width={ note.duration * this.props.beatWidth }
    height={ this.props.trackHeight }
    selected={ this.state.selectedItems.indexOf(i) !== -1 }
    />;
  }
  setEditMode(mode) {
    this.setState({ drawItem: defaultDrawNote });
    this.setState({ editMode: mode });
  }
  updateNotes() {
    this.setState({ displayedItems: this.getItems().map(this.noteMapper) });
  }
  getNoteByCoordinates(pageX, pageY) {
    const searchRectangle = {
      left:   pageX - this.sequencer.offsetLeft + this.sequencer.scrollLeft,
      right:  pageX - this.sequencer.offsetLeft + this.sequencer.scrollLeft,
      top:    pageY - this.sequencer.offsetTop + this.sequencer.scrollTop,
      bottom: pageY - this.sequencer.offsetTop + this.sequencer.scrollTop
    };
    const foundNoteIndexes = this.getItems().reduce((found, note, index) => {
      const noteRectangle = this.getItemRectangle(note);
      if  (doRectanglesIntersect(noteRectangle, searchRectangle)) {
        return found.concat([index]);
      }
      return found;
    }, []);
    if (foundNoteIndexes) {
      return foundNoteIndexes[0];
    }
  }
  getGridPosition(pageX, pageY) {
    const beat = Math.floor((pageX - this.sequencer.offsetLeft + this.sequencer.scrollLeft)/this.props.beatWidth);
    const tone = this.props.trackCount - Math.floor((pageY - this.sequencer.offsetTop + this.sequencer.scrollTop)/this.props.trackHeight);
    return { beat, tone };
  }
  getNotePositionByGrid(beat, tone) {
    const left = beat * this.props.beatWidth + 'px';
    const top = (this.props.trackCount - tone) * this.props.trackHeight + 'px';
    return { left, top };
  }
  calculateDragDistance(pageX, pageY) {
    const { beat, tone } = this.getGridPosition(pageX, pageY);
    const beatDistance = this.state.gridSize * Math.floor((beat - this.state.drag.startBeat)/this.state.gridSize);
    const toneDistance = tone - this.state.drag.startTone;
    return { beatDistance, toneDistance };
  }
  noteDragMouseUp({ pageX, pageY }) {
    document.onmousemove = null;
    document.onmouseup = null;
    const { beatDistance, toneDistance } = this.calculateDragDistance(pageX, pageY);
    this.context.store.dispatch(moveNotes(this.state.selectedItems, beatDistance, toneDistance));
    this.setState({drag: defaultDrag });
    return false;
  }
  noteDragMouseMove({ pageX, pageY }) {
    const { beatDistance, toneDistance } = this.calculateDragDistance(pageX, pageY);
    const newDisplayedItems = this.getItems().map((currentNote, i) => {
      if (this.state.selectedItems.indexOf(i) === -1) {
        return this.noteMapper(currentNote, i);
      }
      const newStart = currentNote.start + beatDistance;
      const newTone = currentNote.tone + toneDistance;
      return this.noteMapper({ start: newStart, tone: newTone, duration: currentNote.duration }, i);
    });
    this.setState({ displayedItems: newDisplayedItems });
  }
  onSequencerMouseDown({ pageX, pageY }) {
    if (this.isClickOutOfSequencer(pageX, pageY)) {
      return false;
    }
    const mode = this.state.editMode;
    if (mode === editModes.draw) {
      const { beat, tone } = this.getGridPosition(pageX, pageY);
      const gridBeat = this.state.gridSize * Math.floor(beat/this.state.gridSize);
      const itemUnderMouse = this.getNoteByCoordinates(pageX, pageY);
      if (itemUnderMouse >= 0) {
        const target = this.state.displayedItems[itemUnderMouse];
        const shiftX = pageX - this.sequencer.offsetLeft + this.sequencer.scrollLeft - parseInt(target.props.left, 10);
        const shiftY = pageY - this.sequencer.offsetTop + this.sequencer.scrollTop - parseInt(target.props.top, 10);
        let newSelection = this.state.selectedItems;
        if (newSelection.indexOf(itemUnderMouse) === -1) {
          newSelection = [itemUnderMouse];
        }
        this.setState({
          selectedItems: newSelection,
          drag: {
            inProgress: true,
            startBeat: gridBeat,
            startTone: tone,
            shiftX,
            shiftY
          }
        });
        document.onmousemove = this.noteDragMouseMove;
        document.onmouseup = this.noteDragMouseUp;
        return false;
      }
      this.setState({
        selectedItems: [],
        drawItem: {
          start: gridBeat,
          tone,
          inProgress: true,
          duration: this.state.gridSize
        }
      });
    }
    if (mode === editModes.select) {
      const startX = pageX - this.sequencer.offsetLeft + this.sequencer.scrollLeft;
      const startY = pageY - this.sequencer.offsetTop + this.sequencer.scrollTop;
      this.setState({ selection: {
        active: true,
        startX,
        startY,
        left: startX,
        top: startY,
        right: 0,
        bottom: 0
      }});
    }
    return false;
  }
  onSequencerMouseUp({ pageX, pageY }) {
    if (this.isClickOutOfSequencer(pageX, pageY)) {
      return false;
    }
    const mode = this.state.editMode;
    if (mode === editModes.draw) {
      if (!this.state.drag.inProgress && this.state.drawItem.inProgress) {
        this.context.store.dispatch(addNote(this.state.drawItem.tone, this.state.drawItem.start, this.state.drawItem.duration));
        this.setState({drawItem: defaultDrawNote});
      }
    }
    if (mode === editModes.erase) {
      const itemUnderMouse = this.getNoteByCoordinates(pageX, pageY);
      if (itemUnderMouse >= 0) {
        let newSelection = this.state.selectedItems;
        if (newSelection.indexOf(itemUnderMouse) === -1) {
          newSelection = [itemUnderMouse];
        }
        this.setState({selectedItems: []});
        this.context.store.dispatch(removeNotes(newSelection));
      }
    }
    if (mode === editModes.select) {
      const newlySelectedItems = this.getItems().reduce((acc, note, index) => {
        if (doRectanglesIntersect(this.getItemRectangle(note), this.state.selection)) {
          return acc.concat(index);
        }
        return acc;
      }, []);
      this.setState({selection: defaultSelection, selectedItems: newlySelectedItems});
      this.setState({displayedItems: this.getItems().map((note, i) => {
        return <SequencerItem key={i}
          left={note.start*this.props.beatWidth}
          top={(this.props.trackCount - note.tone) * this.props.trackHeight}
          width={note.duration * this.props.beatWidth}
          height={this.props.trackHeight}
          selected={newlySelectedItems.indexOf(i) !== -1}
          />;
      })});
    }
    return false;
  }
  onSequencerMouseMove({ pageX, pageY }) {
    const mode = this.state.editMode;
    if (mode === editModes.draw) {
      const { beat, tone } = this.getGridPosition(pageX, pageY);
      if (!this.state.drag.inProgress && this.state.drawItem.inProgress) {
        const calculatedDuration = this.state.gridSize * Math.floor((1 + beat - this.state.drawItem.start)/this.state.gridSize);
        this.setState({
          drawItem: {
            duration: calculatedDuration >= this.state.gridSize ? calculatedDuration : this.state.gridSize,
            tone,
            start: this.state.drawItem.start,
            inProgress: true
          }
        });
      }
    }
    if (mode === editModes.select) {
      if (this.state.selection.active) {
        const x1 = this.state.selection.startX;
        const y1 = this.state.selection.startY;
        const x2 = pageX - this.sequencer.offsetLeft + this.sequencer.scrollLeft;
        const y2 = pageY - this.sequencer.offsetTop + this.sequencer.scrollTop;
        this.setState({ selection: {
          startX: x1,
          startY: y1,
          active: true,
          left: Math.min(x1, x2),
          top: Math.min(y1, y2),
          right: Math.max(x1, x2),
          bottom: Math.max(y1, y2),
        }});
      }
    }
    return false;
  }
/*ADDED BY B3457M0D3~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-~~~~~~~~~~~~~~~~^~*/
  onClearNotes(){ this.context.store.dispatch({ type: 'RESET' }); }
                  /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-~~~~~~~~~~~~~~~~^~*/

  render() {
    return (
      <div>
      <div className="Sequencer-toolbar">
      <ButtonToolbar>
        <SequencerGridDropdown selected={this.state.gridSize} onSelection={(i) => this.setState({gridSize: i})}></SequencerGridDropdown>
        <ButtonGroup>
          <Button active={this.state.editMode === editModes.draw} onClick={() => this.setEditMode(editModes.draw) }><Glyphicon glyph="pencil" /></Button>
          <Button active={this.state.editMode === editModes.erase} onClick={() => this.setEditMode(editModes.erase) }><Glyphicon glyph="remove" /></Button>
          <Button onClick={() => this.onClearNotes() }><Glyphicon glyph="remove" />(ALL)</Button>
          <Button active={this.state.editMode === editModes.select} onClick={() => this.setEditMode(editModes.select) }><Glyphicon glyph="unchecked" /></Button>
        </ButtonGroup>
      </ButtonToolbar>
      </div>
      <div style={{height: this.props.height, width: this.props.width}}>
        <div className="Sequencer-tracklist-outer">
          <div className="Sequencer-tracklist-inner" ref={(c) => this.trackList = c}>
          {this.trackEntries}
          </div>
        </div>
        <div className="Sequencer-lane-outer" ref={(c) => this.sequencer = c}
            onMouseDown={(e) => { this.onSequencerMouseDown(e); return false; }}
            onMouseUp={(e) => { this.onSequencerMouseUp(e); return false; }}
            onMouseMove={(e) => { this.onSequencerMouseMove(e); return false; }}>
          <div className="Sequencer-lane-inner" style={{
            width: this.props.totalBeatCount * this.props.beatWidth,
            height: this.props.trackCount * this.props.trackHeight
          }}>
          {this.trackLanes}
          {this.state.displayedItems}
          <SequencerItem display={this.state.drawItem.inProgress ? 'block' : 'none'}
            key='drawItem'
            left={this.state.drawItem.start*this.props.beatWidth}
            top={(this.props.trackCount - this.state.drawItem.tone)*this.props.trackHeight}
            width={this.state.drawItem.duration * this.props.beatWidth}
            height={this.props.trackHeight}
          />
          <SequencerSelection rect={this.state.selection}></SequencerSelection>
          </div>
        </div>
      </div>
      </div>
      );
  }
}

Sequencer.contextTypes = {
  store: React.PropTypes.object
};

export default Sequencer;
