import React from 'react';
import './PianoRollNote.css';

class PianoRollNote extends React.Component {
  render() {
    return <div style={{left: this.props.left, top: this.props.top, width: this.props.width}} className="PianoRollNote-note" ></div>;
  }
}

export default PianoRollNote;
