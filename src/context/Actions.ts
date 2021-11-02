import { Draft } from 'immer';
import { getCorrelationIndex } from 'nmr-correlation';
import { NMRiumData } from '../types/nmrium/NMRiumData';
import { Result } from '../types/Result';
import { NeighborsEntry } from '../types/webcase/NeighborsEntry';
import ResultRecord from '../types/webcase/ResultRecord';
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

export function clearMolecules(draft: Draft<DataState>) {
  if (draft.resultData?.resultRecord) {
    draft.resultData.resultRecord.dataSetList = [];
  }
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
