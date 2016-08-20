import React from 'react';
import config from '../constants/config';
import actions from '../actions';
import { Button, ButtonGroup, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import NotatorGridDropdown from './NotatorGridDropdown.jsx';
import './styles/NotatorToolBar.css';

/*

*/
const NotatorToolBar = ({editMode,clearNotes}) => <div>
  <div className="Notator-toolbar">
    <ButtonToolbar>
      <NotatorGridDropdown selected={config.gridSize} onSelection={(i) => this.setState({gridSize: i})}></NotatorGridDropdown>
      <ButtonGroup>
        <Button active={editMode === config.editModes.draw} onClick={() => this.setEditMode(config.editModes.draw) }><Glyphicon glyph="pencil" /></Button>
        <Button active={editMode === config.editModes.erase} onClick={() => this.setEditMode(config.editModes.erase) }><Glyphicon glyph="remove" /></Button>
        <Button onClick={() => clearNotes() }><Glyphicon glyph="remove" />(ALL)</Button>
        <Button active={editMode === config.editModes.select} onClick={() => this.setEditMode(config.editModes.select) }><Glyphicon glyph="unchecked" /></Button>
      </ButtonGroup>
    </ButtonToolbar>
  </div>
</div>;


export default NotatorToolBar;
