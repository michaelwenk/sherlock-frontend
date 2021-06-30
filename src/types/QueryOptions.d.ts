export interface QueryOptions {
  dereplicationOptions: {
    shiftTolerances: ShiftTolerances;
    checkMultiplicity: boolean;
    checkEquivalencesCount: boolean;
    useMF: boolean;
  };
  elucidationOptions: {
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
    hybridizationDetectionThreshold: number;
  };
  retrievalOptions: { resultID: string };
}
