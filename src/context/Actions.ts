import { Draft } from 'immer';
import { getCorrelationIndex } from 'nmr-correlation';
import { NMRiumData } from '../types/nmrium/NMRiumData';
import { Result } from '../types/Result';
import FixedNeighbors from '../types/sherlock/FixedNeighbors';
import { NeighborsEntry } from '../types/sherlock/NeighborsEntry';
import ResultRecord from '../types/sherlock/ResultRecord';
import { DataState } from './Reducer';

export interface Action {
  type: string;
  payload: { [key: string]: unknown };
}

export function setNmriumData(draft: Draft<DataState>, action: Action) {
  draft.nmriumData = action.payload.nmriumData as NMRiumData;
}

export function setResultData(draft: Draft<DataState>, action: Action) {
  draft.resultData = action.payload.resultData as Result;
}

export function clearResultData(draft: Draft<DataState>) {
  delete draft.resultData;
}

export function editForbiddenNeighbors(
  draft: Draft<DataState>,
  action: Action,
) {
  const { editedNeighbors, correlation } = action.payload;

  if (draft.resultData?.detections && draft.nmriumData?.correlations) {
    const correlationIndex = getCorrelationIndex(
      draft?.nmriumData?.correlations.values,
      correlation,
    );
    draft.resultData.detections.forbiddenNeighbors[correlationIndex] =
      editedNeighbors as NeighborsEntry;
  }
}

export function editSetNeighbors(draft: Draft<DataState>, action: Action) {
  const { editedNeighbors, correlation } = action.payload;

  if (draft.resultData?.detections && draft.nmriumData?.correlations) {
    const correlationIndex = getCorrelationIndex(
      draft?.nmriumData?.correlations.values,
      correlation,
    );
    draft.resultData.detections.setNeighbors[correlationIndex] =
      editedNeighbors as NeighborsEntry;
  }
}

export function editFixedNeighbors(draft: Draft<DataState>, action: Action) {
  const { fixedNeighbors } = action.payload;

  if (draft.resultData?.detections) {
    draft.resultData.detections.fixedNeighbors =
      fixedNeighbors as FixedNeighbors;
  }
}

export function editHybridizations(draft: Draft<DataState>, action: Action) {
  const { editedHybridizations, correlation } = action.payload;

  if (draft.resultData?.detections && draft.nmriumData?.correlations) {
    const correlationIndex = getCorrelationIndex(
      draft?.nmriumData?.correlations.values,
      correlation,
    );
    draft.resultData.detections.detectedHybridizations[correlationIndex] =
      editedHybridizations as number[];
  }
}

export function setResultDBEntries(draft: Draft<DataState>, action: Action) {
  const { resultRecordList } = action.payload;
  draft.resultDataDB = resultRecordList as ResultRecord[];
}
