import React from 'react';
import { Button, ButtonGroup, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import classNames from 'classnames';
import { noteNames } from '../constants/note-names'
import NotatorItem from './NotatorItem.jsx';
import NotatorSelection from './NotatorSelection.jsx';

import './styles/Notator.css';

const Notator = (props) => {
  const trackCountArray = Array.apply(null, {length: props.trackCount}).map(Number.call, Number).reverse();
  const trackLanes = trackCountArray.map(props.getTrackLane);
  const trackEntries = trackCountArray.map(props.getTrackEntry);
  render() {
    return (
      <div>

      <div style={{height: props.height, width: prp.width}}>
        <div className="Notator-tracklist-outer">
          <div className="Notator-tracklist-inner" ref={(c) => this.trackList = c}>
          {trackEntries}
          </div>
        </div>
        <div className="Notator-lane-outer" ref={(c) => this.Notator = c}
            onMouseDown={(e) => { this.onNotatorMouseDown(e); return false; }}
            onMouseUp={(e) => { this.onNotatorMouseUp(e); return false; }}
            onMouseMove={(e) => { this.onNotatorMouseMove(e); return false; }}>
          <div className="Notator-lane-inner" style={{
            width: props.totalBeatCount * props.beatWidth,
            height: props.trackCount * props.trackHeight
          }}>
          {this.trackLanes}
          {this.state.displayedItems}
          <NotatorItem display={this.state.drawItem.inProgress ? 'block' : 'none'}
            key='drawItem'
            left={this.state.drawItem.start*props.beatWidth}
            top={(props.trackCount - this.state.drawItem.tone)*props.trackHeight}
            width={this.state.drawItem.duration * props.beatWidth}
            height={props.trackHeight}
          />
          <NotatorSelection rect={this.state.selection}></NotatorSelection>
          </div>
        </div>
      </div>
      </div>
      );
  }
}

Notator.contextTypes = {
  store: React.PropTypes.object
};

export default Notator;
