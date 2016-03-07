import React from 'react';
import './PianoRollSelection.css';

class PianoRollSelection extends React.Component {
  render() {
    return <div style={{
      left: this.props.rect.left, 
      top: this.props.rect.top, 
      width: this.props.rect.right - this.props.rect.left, 
      height: this.props.rect.bottom - this.props.rect.top,
      display: this.props.rect.active ? 'block' : 'none'
    }} className="PianoRollSelection" ></div>;
  }
}

export default PianoRollSelection;
