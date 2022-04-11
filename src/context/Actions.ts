import { Draft } from 'immer';
import { getCorrelationIndex } from 'nmr-correlation';
import queryTypes from '../constants/queryTypes';
import DataState from '../types/DataState';
import NMRiumData from '../types/nmrium/NMRiumData';
import Result from '../types/Result';
import Detections from '../types/sherlock/detection/Detections';
import FixedNeighbors from '../types/sherlock/detection/FixedNeighbors';
import NeighborsEntry from '../types/sherlock/detection/NeighborsEntry';
import ResultRecord from '../types/sherlock/ResultRecord';
import lodashCloneDeep from 'lodash/cloneDeep';

const initialDetections: Detections = {
  detectedHybridizations: {},
  detectedConnectivities: {},
  forbiddenNeighbors: {},
  setNeighbors: {},
  fixedNeighbors: {},
};

export interface Action {
  type: string;
  payload: { [key: string]: unknown };
}

export function setNmriumData(draft: Draft<DataState>, action: Action) {
  draft.nmriumData = action.payload.nmriumData as NMRiumData;
}

export function setResultData(draft: Draft<DataState>, action: Action) {
  const { resultData } = action.payload;
  draft.resultData = resultData as Result;

  if (!draft.nmriumData) {
    draft.nmriumData = {
      spectra: [],
    };
  }
  draft.nmriumData.correlations = (
    resultData as Result
  ).resultRecord.correlations;
}

export function clearResultData(draft: Draft<DataState>) {
  delete draft.resultData;
}

function initDetections(draft: Draft<DataState>) {
  if (!draft.resultData) {
    draft.resultData = {
      queryType: queryTypes.dereplication,
      resultRecord: {},
    };
  }
  if (!draft.resultData?.resultRecord?.detections) {
    draft.resultData.resultRecord.detections = initialDetections;
  }
}

export function editForbiddenNeighbors(
  draft: Draft<DataState>,
  action: Action,
) {
  const { editedNeighbors, correlation } = action.payload;

  initDetections(draft);
  const correlationIndex = getCorrelationIndex(
    draft.nmriumData?.correlations.values,
    correlation,
  );
  (draft.resultData as Result).resultRecord.detections.forbiddenNeighbors[
    correlationIndex
  ] = editedNeighbors as NeighborsEntry;
}

export function editSetNeighbors(draft: Draft<DataState>, action: Action) {
  const { editedNeighbors, correlation } = action.payload;

  initDetections(draft);
  const correlationIndex = getCorrelationIndex(
    draft.nmriumData?.correlations.values,
    correlation,
  );
  (draft.resultData as Result).resultRecord.detections.setNeighbors[
    correlationIndex
  ] = editedNeighbors as NeighborsEntry;
}

export function editHybridizations(draft: Draft<DataState>, action: Action) {
  const { editedHybridizations, correlation } = action.payload;

  initDetections(draft);
  const correlationIndex = getCorrelationIndex(
    draft.nmriumData?.correlations.values,
    correlation,
  );
  (draft.resultData as Result).resultRecord.detections.detectedHybridizations[
    correlationIndex
  ] = editedHybridizations as number[];
}

export function editFixedNeighbors(draft: Draft<DataState>, action: Action) {
  const { fixedNeighbors } = action.payload;

  initDetections(draft);

  const temp = lodashCloneDeep(draft.resultData);
  if (temp) {
    temp.resultRecord.detections.fixedNeighbors =
      fixedNeighbors as FixedNeighbors;
    draft.resultData = temp;
  }
}

export function setResultDBEntries(draft: Draft<DataState>, action: Action) {
  const { resultRecordList } = action.payload;
  draft.resultDataDB = resultRecordList as ResultRecord[];
}

export function setIsRequesting(draft: Draft<DataState>, action: Action) {
  const { isRequesting } = action.payload;
  draft.isRequesting = isRequesting as boolean;
}
