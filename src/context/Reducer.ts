import { Draft, produce } from 'immer';
import { NMRiumData } from '../types/nmrium/NMRiumData';
import { Result } from '../types/Result';
import {
  Action,
  clearMolecules,
  editForbiddenNeighbors,
  editHybridizations,
  editSetNeighbors,
  setNmriumData,
  setResultData,
} from './Actions';
import {
  CLEAR_MOLECULES,
  EDIT_FORBIDDEN_NEIGHBORS,
  EDIT_HYBRIDIZATIONS,
  EDIT_SET_NEIGHBORS,
  SET_NMRIUM_DATA,
  SET_RESULT_DATA,
} from './ActionTypes';

export interface DataState {
  nmriumData?: NMRiumData;
  resultData?: Result;
}

export const initialState: DataState = {};

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
    case CLEAR_MOLECULES:
      return clearMolecules(draft);
    case EDIT_FORBIDDEN_NEIGHBORS:
      return editForbiddenNeighbors(draft, action);
    case EDIT_SET_NEIGHBORS:
      return editSetNeighbors(draft, action);
    case EDIT_HYBRIDIZATIONS:
      return editHybridizations(draft, action);

    default:
      return;
  }
}

export const DataReducer = produce(dataReducer);
