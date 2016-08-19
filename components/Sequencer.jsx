import React from 'react';
import { Button, ButtonGroup, Glyphicon, ButtonToolbar } from 'react-bootstrap';

import { doRectanglesIntersect } from '../utils';
import actions from '../actions';
import classNames from 'classnames';
import { noteNames } from '../constants/note-names'
import config from '../constants/config.js';
import SequencerItem from './SequencerItem.jsx';
import SequencerSelection from './SequencerSelection.jsx';
import SequencerGridDropdown from './SequencerGridDropdown.jsx';

import './styles/Sequencer.css';

const { addNote, removeNotes, moveNotes, clearNotes } = actions;

class Sequencer extends React.Component {
  constructor() {
    super();
    this.getTrackEntry = this.getTrackEntry.bind(this);
    this.updateNotes = this.updateNotes.bind(this);
    this.onClearNotes = this.onClearNotes.bind(this);
    this.getGridPosition = this.getGridPosition.bind(this);
    this.noteDragMouseUp = this.noteDragMouseUp.bind(this);
    this.noteDragMouseMove= this.noteDragMouseMove.bind(this);
    this.isClickOutOfSequencer = this.isClickOutOfSequencer.bind(this);
    this.getNoteByCoordinates = this.getNoteByCoordinates.bind(this);
    this.calculateDragDistance = this.calculateDragDistance.bind(this);
    this.getItemRectangle = this.getItemRectangle.bind(this);
    this.seq = this.sequencer;
    this.prp = this.props;
  }
  componentWillMount() {
    this.setState({
      drag: defaultDrag,
      displayedItems: [],
      editMode: editModes.draw,
      drawItem: defaultDrawNote,
      selectedItems: [],
      selection: defaultSelection,
      gridSize: defaultGridSize,
    });
    const trackCountArray = Array.apply(null, {length: this.prp.trackCount}).map(Number.call, Number).reverse();
    this.trackLanes = trackCountArray.map(this.prp.getTrackLane);
    this.trackEntries = trackCountArray.map(this.prp.getTrackEntry);
    this.noteMapper = this.noteMapper.bind(this);
    document.onselectstart = () => false;
    document.ondragstart = () => false;
  }
  componentDidMount() {
    const { store } = this.context;
    store.subscribe(this.updateNotes);
    this.getItems = () => store.getState().notes;
    this.unsubscribe = () => store.unsubscribe();

    this.seq.onscroll = () => {
      this.trackList.style.top = (-this.seq.scrollTop) + 'px';
    };
    this.seq.onselectstart = () => false;
    this.seq.ondragstart = () => false;
    this.updateNotes();
  }
  componentWillUnmount() { this.unsubscribe(); }
  static getNoteFromIndex(index) {
    const octave = Math.floor(index/12);
    const name = noteNames[index % 12];
    const isBlack = name.indexOf('#') !== -1;
    return { octave, name, isBlack };
  }
  static getTrackLane(i) { return <div key={i} style={{height: 16}} className="PianoRoll-lane"></div>; }
  static getTrackEntry(i) {
    const trackEntry = .getNoteFromIndex(i);
    const trackEntryClasses = { 'PianoRoll-key': true, 'PianoRoll-key-black' : trackEntry.isBlack, 'PianoRoll-key-white' : !trackEntry.isBlack };
    return <div key={i} style={{height: 16}} className={classNames(trackEntryClasses)}>{trackEntry.name}{trackEntry.octave}</div>;
  }
  getItemRectangle(note) {
    return {
      left: note.start * this.prp.beatWidth,
      top: (this.prp.trackCount - note.tone) * this.prp.trackHeight,
      right: (note.start + note.duration) * this.prp.beatWidth,
      bottom: (this.prp.trackCount - note.tone) * this.prp.trackHeight + this.prp.trackHeight
    };
  }
  isClickOutOfSequencer(X, Y) {
    const L = this.seq.offsetLeft;
    const Top = this.seq.offsetTop;
    const W = this.seq.offsetWidth;
    const H = this.seq.offsetHeight;
    return (X>=L+W-20 || Y>=Top+H-20);
  }
  noteMapper(note, i) {
    return <SequencerItem
      key={i}
      left={ note.start*this.prp.beatWidth }
      top={ (this.prp.trackCount - note.tone) * this.prp.trackHeight }
      width={ note.duration * this.prp.beatWidth }
      height={ this.prp.trackHeight }
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
  getNoteByCoordinates(X, Y) {
    const L = this.seq.offsetLeft;
    const top = this.seq.offsetTop;
    const scrL = this.seq.scrollLeft;
    const scrT = this.seq.scrollTop;
    const searchRectangle = { left: X-L+scrL, right: X-L+scrL, top: Y-top+scrT, bottom: Y-top+scrT };
    const foundNoteIndexes = this.getItems().reduce((found, note, index) => {
      const noteRectangle = this.getItemRectangle(note);
      if (doRectanglesIntersect(noteRectangle, searchRectangle)) return found.concat([index]);
      return found;
    }, []);
    if (foundNoteIndexes) return foundNoteIndexes[0];
  }
  getGridPosition(X, Y) {
    const beat = Math.floor((X - this.seq.offsetLeft + this.seq.scrollLeft)/this.prp.beatWidth);
    const tone = this.prp.trackCount - Math.floor((Y - this.seq.offsetTop + this.seq.scrollTop)/this.prp.trackHeight);
    return { beat, tone };
  }
  getNotePositionByGrid(beat, tone) {
    const left = beat * this.prp.beatWidth + 'px';
    const top = (this.prp.trackCount - tone) * this.prp.trackHeight + 'px';
    return { left, top };
  }
  calculateDragDistance(X, Y) {
    const { beat, tone } = this.getGridPosition(X, Y);
    const beatDistance = this.state.gridSize * Math.floor((beat - this.state.drag.startBeat)/this.state.gridSize);
    const toneDistance = tone - this.state.drag.startTone;
    return { beatDistance, toneDistance };
  }
  noteDragMouseUp({ X, Y }) {
    document.onmousemove = null;
    document.onmouseup = null;
    const { beatDistance, toneDistance } = this.calculateDragDistance(X, Y);
    this.context.store.dispatch(moveNotes(this.state.selectedItems, beatDistance, toneDistance));
    this.setState({drag: defaultDrag });
    return false;
  }
  noteDragMouseMove({ X, Y }) {
    const { beatDistance, toneDistance } = this.calculateDragDistance(X, Y);
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
  onSequencerMouseDown({ X, Y }) {
    if (this.isClickOutOfSequencer(X, Y)) {
      return false;
    }
    const mode = this.state.editMode;
    if (mode === editModes.draw) {
      const { beat, tone } = this.getGridPosition(X, Y);
      const gridBeat = this.state.gridSize * Math.floor(beat/this.state.gridSize);
      const itemUnderMouse = this.getNoteByCoordinates(X, Y);
      if (itemUnderMouse >= 0) {
        const target = this.state.displayedItems[itemUnderMouse];
        const shiftX = X - this.seq.offsetLeft + this.seq.scrollLeft - parseInt(target.props.left, 10);
        const shiftY = Y - this.seq.offsetTop + this.seq.scrollTop - parseInt(target.props.top, 10);
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
      const startX = X - this.seq.offsetLeft + this.seq.scrollLeft;
      const startY = Y - this.seq.offsetTop + this.seq.scrollTop;
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
  onSequencerMouseUp({ X, Y }) {
    if (this.isClickOutOfSequencer(X, Y)) {
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
      const itemUnderMouse = this.getNoteByCoordinates(X, Y);
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
          left={note.start*this.prp.beatWidth}
          top={(this.prp.trackCount - note.tone) * this.prp.trackHeight}
          width={note.duration * this.prp.beatWidth}
          height={this.prp.trackHeight}
          selected={newlySelectedItems.indexOf(i) !== -1}
          />;
      })});
    }
    return false;
  }
  onSequencerMouseMove({ X, Y }) {
    const mode = this.state.editMode;
    if (mode === editModes.draw) {
      const { beat, tone } = this.getGridPosition(X, Y);
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
        const x2 = X - this.seq.offsetLeft + this.seq.scrollLeft;
        const y2 = Y - this.seq.offsetTop + this.seq.scrollTop;
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
  onClearNotes(){
    this.context.store.dispatch({ type: 'RESET' });
  }
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
      <div style={{height: this.prp.height, width: this.prp.width}}>
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
            width: this.prp.totalBeatCount * this.prp.beatWidth,
            height: this.prp.trackCount * this.prp.trackHeight
          }}>
          {this.trackLanes}
          {this.state.displayedItems}
          <SequencerItem display={this.state.drawItem.inProgress ? 'block' : 'none'}
            key='drawItem'
            left={this.state.drawItem.start*this.prp.beatWidth}
            top={(this.prp.trackCount - this.state.drawItem.tone)*this.prp.trackHeight}
            width={this.state.drawItem.duration * this.prp.beatWidth}
            height={this.prp.trackHeight}
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
