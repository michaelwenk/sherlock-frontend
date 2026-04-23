import { Draft } from 'immer';
import { Correlation, getCorrelationIndex } from 'nmr-correlation';
import queryTypes from '../constants/queryTypes';
import DataState from '../types/DataState';
import Result from '../types/Result';
import Detections from '../types/sherlock/detection/Detections';
import FixedNeighbors from '../types/sherlock/detection/FixedNeighbors';
import NeighborsEntry from '../types/sherlock/detection/NeighborsEntry';
import ResultRecord from '../types/sherlock/ResultRecord';
import lodashCloneDeep from 'lodash/cloneDeep';
import DataSet from '../types/sherlock/dataSet/DataSet';
import generateID from '../utils/generateID';
import { NMRiumState } from 'nmrium';
import initialNMRiumState from '../constants/initialNMRiumState';

const initialDetections: Detections = {
  detectedHybridizations: {},
  detectedConnectivities: {},
  forbiddenNeighbors: {},
  setNeighbors: {},
  fixedNeighbors: {},
  fragments: [],
};

export interface Action {
  type: string;
  payload: {
    [key: string]:
      | Correlation
      | FixedNeighbors
      | NeighborsEntry
      | NMRiumState
      | Result
      | boolean
      | number
      | number[]
      | string;
  };
}

export function clearResultData(draft: Draft<DataState>) {
  delete draft.resultData;
}

function initNMRiumState(draft: Draft<DataState>) {
  if (!draft.nmriumState) {
    draft.nmriumState = initialNMRiumState;
  }
}

function initResultData(draft: Draft<DataState>) {
  if (!draft.resultData) {
    draft.resultData = {
      queryType: queryTypes.dereplication,
      resultRecord: {},
    };
  }
}

function initDetections(draft: Draft<DataState>) {
  initResultData(draft);
  if (!(draft.resultData as Result).resultRecord?.detections) {
    (draft.resultData as Result).resultRecord.detections = initialDetections;
  }
}

export function setNmriumState(draft: Draft<DataState>, action: Action) {
  draft.nmriumState = action.payload.nmriumState as NMRiumState;

  initResultData(draft);
  (draft.resultData as Result).resultRecord = {
    ...draft.resultData?.resultRecord,
    correlations: draft.nmriumState?.data?.correlations,
  };
  initDetections(draft);
  (draft.nmriumState as NMRiumState).data.correlations?.values.forEach(
    (correlation: Correlation, i: number) => {
      const _detections = (draft.resultData as Result).resultRecord
        .detections as Detections;
      if (!_detections.detectedHybridizations[i]) {
        _detections.detectedHybridizations[i] = [];
      }
      correlation.hybridization.forEach((hybrid: number) => {
        if (!_detections.detectedHybridizations[i].includes(hybrid)) {
          _detections.detectedHybridizations[i].push(hybrid);
        }
      });
    },
  );
}

export function setResultData(draft: Draft<DataState>, action: Action) {
  const { resultData } = action.payload;
  const _resultData = resultData as Result;

  draft.resultData = {
    ..._resultData,
    resultRecord: { ..._resultData.resultRecord, nmriumState: undefined },
  };

  initNMRiumState(draft);
  if (_resultData.resultRecord.nmriumState) {
    draft.nmriumState = JSON.parse(
      _resultData.resultRecord.nmriumState,
    ) as Partial<NMRiumState>;
  }
}

export function editForbiddenNeighbors(
  draft: Draft<DataState>,
  action: Action,
) {
  const { editedNeighbors, correlation } = action.payload;

  initDetections(draft);
  const correlationIndex = getCorrelationIndex(
    draft.nmriumState?.data?.correlations?.values ?? [],
    correlation as Correlation,
  );
  (draft.resultData as Result).resultRecord.detections.forbiddenNeighbors[
    correlationIndex
  ] = editedNeighbors as NeighborsEntry;
}

export function editSetNeighbors(draft: Draft<DataState>, action: Action) {
  const { editedNeighbors, correlation } = action.payload;

  initDetections(draft);
  const correlationIndex = getCorrelationIndex(
    draft.nmriumState?.data?.correlations?.values ?? [],
    correlation as Correlation,
  );
  (draft.resultData as Result).resultRecord.detections.setNeighbors[
    correlationIndex
  ] = editedNeighbors as NeighborsEntry;
}

export function editHybridizations(draft: Draft<DataState>, action: Action) {
  const { editedHybridizations, correlation } = action.payload;

  initDetections(draft);
  const correlationIndex = getCorrelationIndex(
    draft.nmriumState?.data?.correlations?.values ?? [],
    correlation as Correlation,
  );
  const tempDetections = lodashCloneDeep(
    draft.resultData?.resultRecord.detections,
  );
  tempDetections.detectedHybridizations[correlationIndex] =
    editedHybridizations as number[];

  const tempCorrelations = lodashCloneDeep(
    draft.resultData?.resultRecord.correlations,
  );
  tempCorrelations.values[correlationIndex].hybridization =
    editedHybridizations as number[];

  if (draft.resultData?.resultRecord) {
    draft.resultData.resultRecord.detections = tempDetections;
    draft.resultData.resultRecord.correlations = tempCorrelations;
  }
  initNMRiumState(draft);
  (draft.nmriumState as NMRiumState).data.correlations = tempCorrelations;
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

export function editIncludeFragment(draft: Draft<DataState>, action: Action) {
  const { index, value } = action.payload;

  initDetections(draft);
  const fragment = lodashCloneDeep(
    draft.resultData?.resultRecord.detections.fragments[index as number],
  ) as DataSet;
  fragment.attachment.include = value as boolean;
  if (draft.resultData && fragment) {
    draft.resultData.resultRecord.detections.fragments[index as number] =
      fragment;
  }
}

export function addFragment(draft: Draft<DataState>, action: Action) {
  const { molfile } = action.payload;

  const newFragment: DataSet = {
    meta: { molfile: molfile as string, id: generateID() },
    attachment: { include: true, custom: true },
  };
  initDetections(draft);
  if (draft.resultData) {
    draft.resultData.resultRecord.detections.fragments.unshift(newFragment);
  }
}

export function editFragment(draft: Draft<DataState>, action: Action) {
  const { index, molfile } = action.payload;

  initDetections(draft);
  const fragment = lodashCloneDeep(
    draft.resultData?.resultRecord.detections.fragments[index as number],
  ) as DataSet;
  fragment.meta.molfile = molfile as string;
  delete fragment.structure;
  delete fragment.spectrum;
  delete fragment.assignment;

  if (draft.resultData) {
    draft.resultData.resultRecord.detections.fragments[index as number] =
      fragment;
  }
}

export function deleteFragment(draft: Draft<DataState>, action: Action) {
  const { index } = action.payload;

  initDetections(draft);
  const fragments = lodashCloneDeep(
    draft.resultData?.resultRecord.detections.fragments,
  ) as DataSet[];
  fragments.splice(index as number, 1);

  if (draft.resultData) {
    draft.resultData.resultRecord.detections.fragments = fragments;
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
