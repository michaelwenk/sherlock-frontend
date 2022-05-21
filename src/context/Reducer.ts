import { Draft, produce } from 'immer';
import queryTypes from '../constants/queryTypes';
import DataState from '../types/DataState';
import {
  Action,
  clearResultData,
  editFixedNeighbors,
  editForbiddenNeighbors,
  editHybridizations,
  editIncludeFragment,
  editSetNeighbors,
  setIsRequesting,
  setNmriumData,
  setResultData,
  setResultDBEntries,
} from './Actions';
import {
  CLEAR_RESULT_DATA,
  EDIT_FIXED_NEIGHBORS,
  EDIT_FORBIDDEN_NEIGHBORS,
  EDIT_HYBRIDIZATIONS,
  EDIT_INCLUDE_FRAGMENT,
  EDIT_SET_NEIGHBORS,
  SET_IS_REQUESTING,
  SET_NMRIUM_DATA,
  SET_RESULT_DATA,
  SET_RESULT_DB_ENTRIES,
} from './ActionTypes';

export const initialState: DataState = {
  resultData: {
    queryType: queryTypes.dereplication,
    resultRecord: {},
  },
  isRequesting: false,
};

export function initState(state: DataState): DataState {
  return {
    ...state,
  };
}

export function dispatcher(dispatch) {
  return (action: Action) => dispatch(action);
}

function dataReducer(draft: Draft<DataState>, action: Action) {
  switch (action.type) {
    case SET_NMRIUM_DATA:
      return setNmriumData(draft, action);
    case SET_RESULT_DATA:
      return setResultData(draft, action);
    case CLEAR_RESULT_DATA:
      return clearResultData(draft);
    case EDIT_FORBIDDEN_NEIGHBORS:
      return editForbiddenNeighbors(draft, action);
    case EDIT_SET_NEIGHBORS:
      return editSetNeighbors(draft, action);
    case EDIT_FIXED_NEIGHBORS:
      return editFixedNeighbors(draft, action);
    case EDIT_HYBRIDIZATIONS:
      return editHybridizations(draft, action);
    case EDIT_INCLUDE_FRAGMENT:
      return editIncludeFragment(draft, action);
    case SET_RESULT_DB_ENTRIES:
      return setResultDBEntries(draft, action);
    case SET_IS_REQUESTING:
      return setIsRequesting(draft, action);

    default:
      return;
  }
}

export const DataReducer = produce(dataReducer);
