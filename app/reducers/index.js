// @flow
import { combineReducers } from 'redux';

import nav from './navigation';
import apisettings from './apisettings';

const rootReducer = combineReducers({
  nav,
  apisettings
});

export default rootReducer;
