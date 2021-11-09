import { QueryOptions } from '../types/QueryOptions';
import defaultTolerance from './defaultTolerance';
import queryTypes from './queryTypes';
import retrievalActions from './retrievalAction';

const defaultQueryOptions: QueryOptions = {
  queryType: queryTypes.dereplication,
  dereplicationOptions: {
    shiftTolerances: defaultTolerance,
    checkMultiplicity: true,
    checkEquivalencesCount: true,
    useMF: true,
    maxAverageDeviation: 1,
  },
  elucidationOptions: {
    // PyLSD options
    allowHeteroHeteroBonds: false,
    useElim: false,
    elimP1: 1, // number of correlations (HMBC/COSY) to eliminate
    elimP2: 4, // number of bonds between the atoms
    hmbcP3: 2, // minimal coupling path length HMBC
    hmbcP4: 4, // maximal coupling path length HMBC
    cosyP3: 3, // minimal coupling path length COSY
    cosyP4: 4, // maximal coupling path length COSY
    useFilterLsdRing3: false,
    useFilterLsdRing4: false,
    // elucidation process
    timeLimitTotal: 5,
    // generated structures filter
    maxAverageDeviation: 10,
  },
  detectionOptions: {
    hybridizationDetectionThreshold: 0.01,
    lowerElementCountThreshold: 0.001,
    upperElementCountThreshold: 0.9,
  },
  retrievalOptions: { action: retrievalActions.fetch, resultID: '' },
};

export default defaultQueryOptions;
