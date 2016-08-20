import React from 'react';
import './styles/NotatorItem.css';
import classNames from 'classnames';

class NotatorItem extends React.Component {
  render() {
    return <div
      style={{left: this.props.left + 1, top: this.props.top, width: this.props.width - 1, height: this.props.height}}
      className={classNames('NotatorItem-note', {'NotatorItem-selected' : this.props.selected })}>
    </div>;
  }
}

export default NotatorItem;
