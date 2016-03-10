import React from 'react';

import classNames from 'classnames';
import Sequencer from './Sequencer.jsx';
import './PianoRoll.css';

const noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
function getNoteFromIndex(index) {
  const octave = Math.floor(index/12);
  const name = noteNames[index % 12];
  const isBlack = name.indexOf('#') !== -1;
  return { octave, name, isBlack };
}

function getTrackLane(i) {
  return <div key={i} style={{height: 16}} className="PianoRoll-lane"></div>;
}

function getTrackEntry(i) {
  const trackEntry = getNoteFromIndex(i);
  const trackEntryClasses = {
    'PianoRoll-key': true,
    'PianoRoll-key-black' : trackEntry.isBlack,
    'PianoRoll-key-white' : !trackEntry.isBlack
  };
  return <div key={i} style={{height: 16}} className={classNames(trackEntryClasses)}>{trackEntry.name}{trackEntry.octave}</div>;
}

class PianoRoll extends React.Component {
  render() {
    return <Sequencer 
      width='600px' 
      height='300px' 
      totalBeatCount={64} 
      trackCount={60} 
      beatWidth={24} 
      trackHeight={16}
      getTrackEntry={getTrackEntry}
      getTrackLane={getTrackLane}/>;
  }
}

export default PianoRoll;