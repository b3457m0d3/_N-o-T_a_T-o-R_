import React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

const gridSizes = {
  1: '1/32',
  2: '1/16',
  4: '1/8',
  8: '1/4',
};

class PianoRollGridDropdown extends React.Component {
  render() {
    return <Dropdown id="gridsize-dropdown">
      <Dropdown.Toggle>
        {gridSizes[this.props.selected]}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {Object.keys(gridSizes).map((i) => { 
          return <MenuItem 
              key={i} 
              onClick={() => this.props.onSelection(parseInt(i, 10))}
              active={this.props.selected == i}>{gridSizes[i]}
            </MenuItem>; 
        })}
      </Dropdown.Menu>
    </Dropdown>;  
  }
}

export default PianoRollGridDropdown;