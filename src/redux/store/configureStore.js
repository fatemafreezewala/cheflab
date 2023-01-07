import {createStore, combineReducers} from 'redux';

import Reducer from '../reducers';

const rootReducer = combineReducers({state: Reducer});

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;
