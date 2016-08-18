import React from 'react';
import { Button, ButtonGroup, Glyphicon, ButtonToolbar } from 'react-bootstrap';
import defaults from '../constants/defaults';
import actions from '../actions';
import SequencerGridDropdown from './SequencerGridDropdown.jsx';
import './styles/SequencerToolBar.css';

class SequencerToolBar extends React.Component {
  constructor() {
    super();
    this.onClearNotes = this.onClearNotes.bind(this);
    this.onUndo = this.onUndo.bind(this);
  }
  componentWillMount() {
    this.setState({
      editMode: defaults.editModes.draw,
    });
  }
  componentDidMount() {
    const { store } = this.context;
    this.getItems = () => store.getState().notes;
    console.log(this.getItems);
  //  store.subscribe(this.setEditMode);
  //  this.unsubscribe = () => store.unsubscribe();
  }
  componentWillUnmount() { /*this.unsubscribe();*/ }
  setEditMode(mode) {
    this.setState({ drawItem: defaults.defaultDrawNote});
    this.setState({ editMode: mode });
  }
  onClearNotes(){ this.context.store.dispatch({ type: 'RESET' }); }
  onUndo(){ this.context.store.dispatch({ type: 'UNDO' }); }
  render() {
    return (
      <div>
        <div className="Sequencer-toolbar">
          <ButtonToolbar>
            <SequencerGridDropdown selected={defaults.gridSize} onSelection={(i) => this.setState({gridSize: i})}></SequencerGridDropdown>
            <ButtonGroup>
              <Button active={this.state.editMode === defaults.editModes.draw} onClick={() => this.setEditMode(defaults.editModes.draw) }><Glyphicon glyph="pencil" /></Button>
              <Button active={this.state.editMode === defaults.editModes.erase} onClick={() => this.setEditMode(defaults.editModes.erase) }><Glyphicon glyph="remove" /></Button>
              <Button onClick={() => this.onClearNotes() }><Glyphicon glyph="remove" />(ALL)</Button>
              <Button onClick={() => this.onUndo() }><Glyphicon glyph="backward" /></Button>
              <Button active={this.state.editMode === defaults.editModes.select} onClick={() => this.setEditMode(defaults.editModes.select) }><Glyphicon glyph="unchecked" /></Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>
      </div>
    );
  }
}
SequencerToolBar.contextTypes = { store: React.PropTypes.object };

export default SequencerToolBar;
