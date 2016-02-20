import React from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup, Glyphicon, ButtonToolbar } from 'react-bootstrap';

import PianoRollNote from './PianoRollNote.jsx';
import { addNote, removeNote } from './action-creators';

import './PianoRoll.css';

const noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const editModes = {
  draw: 'draw',
  select: 'select',
  erase: 'erase',
};
const defaultDrawNote = {inProgress: false, duration: 1, tone: 0, start: 0};

const noteWidth = 25;
const noteHeight = 16;

function getNoteFromIndex(index) {
  const octave = Math.floor(index/12);
  const name = noteNames[index % 12];
  const isBlack = name.indexOf('#') !== -1;
  return { octave, name, isBlack };
}

const keyCount = 60;
const keyCountArray = Array.from(Array(keyCount).keys()).reverse();
const keyLanes = keyCountArray.map((i) => {
  return <div key={i} className="PianoRoll-lane"></div>;
});
const keyList = keyCountArray.map((i) => {
  const note = getNoteFromIndex(i);
  const keyClasses = {
    'PianoRoll-key-black' : note.isBlack,
    'PianoRoll-key-white' : !note.isBlack
  };
  return <div key={i} className={classNames('PianoRoll-key', keyClasses)}>{note.name}{note.octave}</div>;
});

class PianoRoll extends React.Component {
  constructor() {
    super();
    this.updateNotes = this.updateNotes.bind(this);
    this.getNotePosition = this.getNotePosition.bind(this);
  }
  componentWillMount() {
    this.setState({
      displayedNotes: [],
      editMode: editModes.draw,
      drawNote: defaultDrawNote
    });
    this.noteMapper = this.noteMapper.bind(this);
    this.props.store.subscribe(this.updateNotes);
  }
  componentDidMount() {
    this.sequencer.onscroll = () => {
      this.keyboard.style.top = (-this.sequencer.scrollTop) + 'px';
    };
    this.updateNotes();
  }
  noteMapper(note, i) {
    return <PianoRollNote key={i} 
    left={note.start*noteWidth} 
    top={(keyCount - note.tone)*noteHeight}
    width={note.duration * noteWidth}
    />;
  }
  setEditMode(mode) {
    this.setState({drawNote: defaultDrawNote})
    this.setState({editMode: mode});
  }
  updateNotes() {
    this.setState({displayedNotes: this.props.store.getState().notes.map(this.noteMapper)});
  }
  getNotePosition(pageX, pageY) {
    const beat = Math.floor((pageX - this.sequencer.offsetLeft + this.sequencer.scrollLeft)/noteWidth);
    const tone = keyCount - Math.floor((pageY - this.sequencer.offsetTop + this.sequencer.scrollTop)/noteHeight);
    return {beat, tone};
  }
  onSequencerMouseDown({pageX, pageY}) {
    const {beat, tone} = this.getNotePosition(pageX, pageY);
    const mode = this.state.editMode;
    if (mode === editModes.draw) {
      this.setState({drawNote: {
        start: beat, 
        tone, 
        inProgress: true, 
        duration: 1
      }});
    }
  }
  onSequencerMouseUp({pageX, pageY}) {
    const {beat, tone} = this.getNotePosition(pageX, pageY);
    const mode = this.state.editMode;
    if (mode === editModes.draw) {
      this.props.store.dispatch(addNote(this.state.drawNote.tone, this.state.drawNote.start, this.state.drawNote.duration));
      this.setState({drawNote: defaultDrawNote});      
    }
    if (mode === editModes.erase) {
      this.props.store.dispatch(removeNote(beat, tone));
    }
  }
  onSequencerMouseMove({pageX, pageY}) {
    const {beat, tone} = this.getNotePosition(pageX, pageY);
    const mode = this.state.editMode;
    if (mode === editModes.draw) {
      if (this.state.drawNote.inProgress) {
        this.setState({drawNote: {
          duration: 1 + beat - this.state.drawNote.start, 
          tone,
          start: this.state.drawNote.start,
          inProgress: true
        }});
      }
    }
  }
  render() {
    return (
      <div>
      <div className="PianoRoll-toolbar">
      <ButtonToolbar>
        <ButtonGroup>
          <Button active={this.state.editMode === editModes.draw} onClick={() => this.setEditMode(editModes.draw)}><Glyphicon glyph="pencil" /></Button>
          <Button active={this.state.editMode === editModes.erase} onClick={() => this.setEditMode(editModes.erase)}><Glyphicon glyph="remove" /></Button>
          <Button active={this.state.editMode === editModes.select} onClick={() => this.setEditMode(editModes.select)}><Glyphicon glyph="unchecked" /></Button>          
        </ButtonGroup>
        <ButtonGroup>
          <Button><Glyphicon glyph="play" /></Button>
          <Button><Glyphicon glyph="stop" /></Button>
        </ButtonGroup>
      </ButtonToolbar>
      </div>
      <div style={{height: this.props.height, width: this.props.width}}>
        <div className="PianoRoll-keylist-outer">
          <div className="PianoRoll-keylist-inner" ref={(c) => this.keyboard = c}>
          {keyList}
          </div>
        </div>
        <div className="PianoRoll-lane-outer" ref={(c) => this.sequencer = c}>
          <div className="PianoRoll-lane-inner" 
            onMouseDown={(e) => this.onSequencerMouseDown(e)}
            onMouseUp={(e) => this.onSequencerMouseUp(e)}
            onMouseMove={(e) => this.onSequencerMouseMove(e)}>
          {keyLanes}
          {this.state.displayedNotes}
          <PianoRollNote display={this.state.drawNote.inProgress ? 'block' : 'none'} 
          key='drawNote'
          left={this.state.drawNote.start*noteWidth} 
          top={(keyCount - this.state.drawNote.tone)*noteHeight}
          width={this.state.drawNote.duration * noteWidth}
          />
          </div>
        </div>
      </div>
      </div>
      );
  }
}

export default PianoRoll;
