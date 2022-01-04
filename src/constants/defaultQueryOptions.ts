import QueryOptions from '../types/QueryOptions';
import queryTypes from './queryTypes';
import retrievalActions from './retrievalAction';

const defaultQueryOptions: QueryOptions = {
  queryType: queryTypes.dereplication,
  dereplicationOptions: {
    shiftTolerance: 2,
    maxAverageDeviation: 1,
    checkMultiplicity: true,
    checkEquivalencesCount: true,
    useMF: true,
  },
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
    // generated structures filter
    maxAverageDeviation: 5,
  },
  detectionOptions: {
    useHybridizationDetections: true,
    useNeighborDetections: true,
    hybridizationDetectionThreshold: 0.01,
    lowerElementCountThreshold: 0.01,
    upperElementCountThreshold: 0.9,
  },
  retrievalOptions: {
    action: retrievalActions.fetch,
    resultID: '',
    resultName: '',
  },
};

export default defaultQueryOptions;
