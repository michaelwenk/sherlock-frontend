import RetrievalOptions from './webcase/RetrievalOptions';

export interface QueryOptions {
  queryType: string;
  dereplicationOptions: {
    shiftTolerances: ShiftTolerances;
    checkMultiplicity: boolean;
    checkEquivalencesCount: boolean;
    useMF: boolean;
    maxAverageDeviation: number;
  };
  elucidationOptions: {
    // PyLSD options
    allowHeteroHeteroBonds: boolean;
    useElim: boolean;
    elimP1: number;
    elimP2: number;
    hmbcP3: number;
    hmbcP4: number;
    cosyP3: number;
    cosyP4: number;
    useFilterLsdRing3: boolean;
    useFilterLsdRing4: boolean;
    // elucidation process
    timeLimitTotal: number;
    // generated structures filter
    maxAverageDeviation: number;
  };
  detectionOptions: {
    hybridizationDetectionThreshold: number;
    lowerElementCountThreshold: number;
    upperElementCountThreshold: number;
  };
  retrievalOptions: RetrievalOptions;
}
