import React from 'react';
import './PianoRollNote.css';
import classNames from 'classnames';

class PianoRollNote extends React.Component {
  render() {
    return <div 
      id={this.props.uniqueId} 
      style={{left: this.props.left, top: this.props.top, width: this.props.width}} 
      className={classNames('PianoRollNote-note', {'PianoRollNote-selected' : this.props.selected })}>
    </div>;
  }
}

export default PianoRollNote;
