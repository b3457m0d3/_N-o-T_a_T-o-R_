import React from 'react';
import classNames from 'classnames';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';

import PianoRollNote from './PianoRollNote.jsx';
import { addNote, removeNote } from './action-creators';

import './PianoRoll.css';

const noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

const noteWidth = 25;
const noteHeight = 16;
const defaultYOffset = 0;
const defaultXOffset = 50;

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
    this.update = this.update.bind(this);
  }
  componentWillMount() {
    this.setState({
      displayedNotes: [],
      scrollXPos: 0,
      scrollYPos: 0,
    });
    this.noteMapper = this.noteMapper.bind(this);
    this.props.store.subscribe(this.update);
  }
  componentDidMount() {
    this.sequencer.onscroll = () => {
      this.keyboard.style.top = (-this.sequencer.scrollTop) + 'px';
      this.setState({
        scrollYPos: this.sequencer.scrollTop,
        scrollXPos: this.sequencer.scrollLeft,
      });
    };
    this.update();
  }
  noteMapper(note, i) {
    return <PianoRollNote key={i} 
    left={note.start*noteWidth} 
    top={note.tone*noteHeight}
    width={note.length * noteWidth}
    />
  }
  update() {
    this.setState({displayedNotes: this.props.store.getState().notes.map(this.noteMapper)});
  }
  onEmptyCellClick({clientX, clientY}) {
    if (!this.state) {
      return;
    }
    const start = Math.floor((clientX - defaultXOffset + this.state.scrollXPos)/noteWidth);
    const tone = Math.floor((clientY - defaultYOffset + this.state.scrollYPos)/noteHeight);
    const length = 1;
    if (!isNaN(start) && !isNaN(tone)) {
      this.props.store.dispatch(addNote(tone, start, length)); 
    }
  }
  render() {
    return (
      <div>
      <div>
        <ButtonGroup className="PianoRoll-toolbar">
          <Button><Glyphicon glyph="pencil" /></Button>
          <Button><Glyphicon glyph="unchecked" /></Button>
          <Button><Glyphicon glyph="remove" /></Button>
        </ButtonGroup>
        <ButtonGroup className="PianoRoll-toolbar">
          <Button><Glyphicon glyph="play" /></Button>
          <Button><Glyphicon glyph="stop" /></Button>
        </ButtonGroup>        
      </div>
      <div style={{height: this.props.height, width: this.props.width}}>
        <div className="PianoRoll-keylist-outer">
          <div className="PianoRoll-keylist-inner" ref={(c) => this.keyboard = c}>
          {keyList}
          </div>
        </div>
        <div className="PianoRoll-lane-outer" ref={(c) => this.sequencer = c}>
          <div className="PianoRoll-lane-inner" onClick={(e) => this.onEmptyCellClick(e)}>
          {keyLanes}
          {this.state.displayedNotes}
          </div>
        </div>
      </div>
      </div>
      );
  }
}

export default PianoRoll;
