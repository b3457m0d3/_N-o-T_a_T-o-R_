import { combineReducers } from 'redux';
import undoable from './undoable';
import sequencer from './sequencer';

export default combineReducers({
  sequencer: undoable(sequencer)
});
