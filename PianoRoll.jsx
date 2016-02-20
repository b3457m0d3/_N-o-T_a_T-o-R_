import React from 'react';
import classNames from 'classnames';
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
    this.onNoteClick = this.onNoteClick.bind(this);
    //this.onEmptyCellClick = this.onEmptyCellClick(this);    
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
  onNoteClick() {
    this.props.store.dispatch(removeNote(i));
  }
  noteMapper(note, i) {
    return <PianoRollNote onClick={this.onNoteClick} key={i} 
    left={this.state.scrollXPos + note.start*noteWidth} 
    top={this.state.scrollYPos + note.tone*noteHeight}
    width={note.length * noteWidth}
    />
  }
  update() {
    console.log(this.props.store.getState());
    this.setState({displayedNotes: this.props.store.getState().notes.map(this.noteMapper)});
  }
  onEmptyCellClick(e) {
    const start = Math.floor((e.clientX - defaultXOffset)/noteWidth);
    const tone = Math.floor((e.clientY - defaultYOffset)/noteHeight);
    const length = 1;
    console.log(start, tone);
    if (!isNaN(start) && !isNaN(tone)) {
      this.props.store.dispatch(addNote(tone, start, length)); 
    }
  }
  render() {
    return (
      <div style={{height: this.props.height, width: this.props.width}}>
        <div className="PianoRoll-keylist-outer">
          <div className="PianoRoll-keylist-inner" ref={(c) => this.keyboard = c}>
          {keyList}
          </div>
        </div>
        <div className="PianoRoll-lane-outer" ref={(c) => this.sequencer = c}>
          <div className="PianoRoll-lane-inner" onClick={this.onEmptyCellClick}>
          {keyLanes}
          {this.state.displayedNotes}
          </div>
        </div>
      </div>);
  }
}

export default PianoRoll;
