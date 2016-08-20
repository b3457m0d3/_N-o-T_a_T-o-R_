import { createStore, compose } from 'redux';
import reduxReset from 'redux-reset';
const createEnhancedStore = compose(reduxReset())(createStore);
export default createEnhancedStore;
