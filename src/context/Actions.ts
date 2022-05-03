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

// function chunkSubstr(str: string, size: number) {
//   const numChunks = Math.ceil(str.length / size);
//   const chunks: string[] = new Array(numChunks);

//   for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
//     const substr = str.substr(o, size);
//     chunks[i] = substr; //new TextEncoder().encode(substr);
//   }

//   return chunks;
// }

export function setNmriumData(draft: Draft<DataState>, action: Action) {
  const { nmriumData } = action.payload;
  draft.nmriumData = nmriumData as NMRiumData;

  // const nmriumDataJson = JSON.stringify({
  //   spectra: draft.nmriumData.spectra,
  //   correlations: draft.nmriumData.correlations,
  // });

  // const nmriumDataJsonParts = chunkSubstr(nmriumDataJson, 10000);

  // draft.resultData = {
  //   queryType: draft.resultData?.queryType as string,
  //   resultRecord: {
  //     ...draft.resultData?.resultRecord,
  //     nmriumDataJsonParts,
  //   },
  // };
}

export function setResultData(draft: Draft<DataState>, action: Action) {
  const { queryType, resultData } = action.payload;
  draft.resultData = resultData as Result;

  if (!draft.nmriumData) {
    draft.nmriumData = {
      spectra: [],
    } as NMRiumData;
  }
  draft.nmriumData.correlations = (
    resultData as Result
  ).resultRecord.correlations;

  if (queryType === queryTypes.retrieval) {
    draft.isRetrieving = true;
  }
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

export function setIsRetrieving(draft: Draft<DataState>, action: Action) {
  const { isRetrieving } = action.payload;
  draft.isRetrieving = isRetrieving as boolean;
}
