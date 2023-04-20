import QueryOptions from '../types/QueryOptions';
import DereplicationOptions from '../types/sherlock/DereplicationOptions';
import DetectionOptions from '../types/sherlock/detection/DetectionOptions';
import ElucidationOptions from '../types/sherlock/ElucidationOptions';
import PredictionOptions from '../types/sherlock/PredictionOptions';
import RetrievalOptions from '../types/sherlock/RetrievalOptions';
import queryTypes from './queryTypes';
import retrievalActions from './retrievalAction';

const defaultQueryOptions: QueryOptions = {
  queryType: queryTypes.dereplication,
  dereplicationOptions: {
    shiftTolerance: 2,
    maximumAverageDeviation: 1,
    checkMultiplicity: true,
    checkEquivalencesCount: true,
    useMF: true,
  } as DereplicationOptions,
  elucidationOptions: {
    // PyLSD options
    allowHeteroHeteroBonds: false,
    useElim: false,
    elimP1: 1, // number of correlations (HMBC/COSY) to eliminate
    elimP2: 4, // number of bonds between the atoms
    useFilterLsdRing3: false,
    useFilterLsdRing4: false,
    // elucidation process
    timeLimitTotal: 5,
    //
    useCombinatorics: false,
  } as ElucidationOptions,
  detectionOptions: {
    useHybridizationDetections: true,
    useNeighborDetections: true,
    hybridizationDetectionThreshold: 0.01,
    lowerElementCountThreshold: 0.01,
    upperElementCountThreshold: 0.95,
    detectFragments: false,
    shiftToleranceFragmentDetection: 1,
    maximumAverageDeviationFragmentDetection: 1,
  } as DetectionOptions,
  predictionOptions: {
    // generated structures filter
    shiftTolerance: 10,
    maximumAverageDeviation: 5,
    predictWithStereo: false,
    stereoPredictionLimit: 10,
  } as PredictionOptions,
  retrievalOptions: {
    action: retrievalActions.fetch,
    resultID: '',
    resultName: '',
  } as RetrievalOptions,
};

export default defaultQueryOptions;
