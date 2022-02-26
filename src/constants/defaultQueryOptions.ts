import QueryOptions from '../types/QueryOptions';
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
    shiftTolerance: 30,
    maximumAverageDeviation: 5,
    useCombinatorics: true,
  },
  detectionOptions: {
    useHybridizationDetections: true,
    useNeighborDetections: true,
    hybridizationDetectionThreshold: 0.01,
    lowerElementCountThreshold: 0.01,
    upperElementCountThreshold: 0.95,
  },
  retrievalOptions: {
    action: retrievalActions.fetch,
    resultID: '',
    resultName: '',
  },
};

export default defaultQueryOptions;
