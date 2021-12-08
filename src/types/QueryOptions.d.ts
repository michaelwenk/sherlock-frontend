import RetrievalOptions from './sherlock/RetrievalOptions';

export interface QueryOptions {
  queryType: string;
  dereplicationOptions: {
    shiftTolerance: number;
    maxAverageDeviation: number;
    checkMultiplicity: boolean;
    checkEquivalencesCount: boolean;
    useMF: boolean;
  };
  elucidationOptions: {
    // PyLSD options
    allowHeteroHeteroBonds: boolean;
    useElim: boolean;
    elimP1: number;
    elimP2: number;
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
