import React from 'react';
import { noteNames } from '../constants/note-names';
import { doRectanglesIntersect } from '../utils';
import actions from '../actions';
import config from '../constants/config.js';
import Notator from './Notator.jsx';
import NotatorToolBar from './NotatorToolBar.jsx';

import './styles/PianoRoll.css';
const { addNote, removeNotes, moveNotes, clearNotes } = actions;


class NotatorContainer extends React.Component {
  constructor() {
    super();
  }
  //==============================================[ Life-Cycle Hooks ]========//
  componentWillMount() {
    this.setState({
      drag: config.defaultDrag,
      displayedItems: [],
      editMode: config.editModes.draw,
      drawItem: config.defaultDrawNote,
      selectedItems: [],
      selection: config.defaultSelection,
      gridSize: config.defaultGridSize
    });

    document.onselectstart = () => false;
    document.ondragstart = () => false;
  }
  componentDidMount() {
    const { store } = this.context;
    store.subscribe(this.updateNotes);
    this.getPattern = () => store.getState().notes;
    this.unsubscribe = () => store.unsubscribe();

    this.seq.onscroll = () => {
      this.trackList.style.top = (-this.seq.scrollTop) + 'px';
    };
    this.seq.onselectstart = () => false;
    this.seq.ondragstart = () => false;
    this.updateNotes();
  }
  componentWillUnmount() { /*this.unsubscribe();*/ }
  setEditMode(mode) {
    this.setState({ drawItem: defaultDrawNote });
    this.setState({ editMode: mode });
  }
  getNoteFromIndex(index) {
    const octave = Math.floor(index/12);
    const name = noteNames[index % 12];
    const isBlack = name.indexOf('#') !== -1;
    return { octave, name, isBlack };
  }
  getTrackLane(i) { return <div key={i} style={{height: 16}} className="PianoRoll-lane"></div>; }
  getTrackEntry(i) {
    const trackEntry = this.getNoteFromIndex(i);
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
  isClickOutOfNotator(X, Y) {
    const L = this.seq.offsetLeft;
    const Top = this.seq.offsetTop;
    const W = this.seq.offsetWidth;
    const H = this.seq.offsetHeight;
    return (X>=L+W-20 || Y>=Top+H-20);
  }
  noteMapper(note, i) {
    return <NotatorItem
      key={i}
      left={ note.start*this.prp.beatWidth }
      top={ (this.prp.trackCount - note.tone) * this.prp.trackHeight }
      width={ note.duration * this.prp.beatWidth }
      height={ this.prp.trackHeight }
      selected={ this.state.selectedItems.indexOf(i) !== -1 }
    />;
  }

  updateNotes() {
    this.setState({ displayedItems: this.getPattern().map(this.noteMapper) });
  }
  getNoteByCoordinates(X, Y) {
    const L = this.seq.offsetLeft;
    const top = this.seq.offsetTop;
    const scrL = this.seq.scrollLeft;
    const scrT = this.seq.scrollTop;
    const searchRectangle = { left: X-L+scrL, right: X-L+scrL, top: Y-top+scrT, bottom: Y-top+scrT };
    const foundNoteIndexes = this.getPattern().reduce((found, note, index) => {
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
    const newDisplayedItems = this.getPattern().map((currentNote, i) => {
      if (this.state.selectedItems.indexOf(i) === -1) {
        return this.noteMapper(currentNote, i);
      }
      const newStart = currentNote.start + beatDistance;
      const newTone = currentNote.tone + toneDistance;
      return this.noteMapper({ start: newStart, tone: newTone, duration: currentNote.duration }, i);
    });
    this.setState({ displayedItems: newDisplayedItems });
  }
  onNotatorMouseDown({ X, Y }) {
    if (this.isClickOutOfNotator(X, Y)) {
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
  onNotatorMouseUp({ X, Y }) {
    if (this.isClickOutOfNotator(X, Y)) {
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
      const newlySelectedItems = this.getPattern().reduce((acc, note, index) => {
        if (doRectanglesIntersect(this.getItemRectangle(note), this.state.selection)) {
          return acc.concat(index);
        }
        return acc;
      }, []);
      this.setState({selection: defaultSelection, selectedItems: newlySelectedItems});
      this.setState({displayedItems: this.getPattern().map((note, i) => {
        return <NotatorItem key={i}
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
  onNotatorMouseMove({ X, Y }) {
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
  onClearNotes(){ store.dispatch({ type: 'RESET' }); }
  render(){
    return (
      <div>
        <NotatorToolBar></NotatorToolBar>
        <Notator
          width='600px'
          height='300px'
          totalBeatCount={64}
          trackCount={60}
          beatWidth={24}
          trackHeight={16}
          getTrackEntry={this.getTrackEntry}
          getTrackLane={this.getTrackLane}/>
      </div>
    );
  }
}

export default NotatorContainer;
