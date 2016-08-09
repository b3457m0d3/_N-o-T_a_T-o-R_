import React from 'react';
import './styles/SequencerItem.css';
import classNames from 'classnames';

class SequencerItem extends React.Component {
  render() {
    return <div
      style={{left: this.props.left + 1, top: this.props.top, width: this.props.width - 1, height: this.props.height}}
      className={classNames('SequencerItem-note', {'SequencerItem-selected' : this.props.selected })}>
    </div>;
  }
}

export default SequencerItem;
