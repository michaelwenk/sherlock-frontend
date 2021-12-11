import { QueryOptions } from '../types/QueryOptions';

export interface ShiftToleranceError {
  [atomType: string]: string;
}

export interface ValidationErrors {
  dereplicationOptions?: {
    shiftTolerance: number;
    maxAverageDeviation: number;
    checkMultiplicity?: string;
    checkEquivalencesCount?: string;
    useMF?: string;
  };
  elucidationOptions?: {
    allowHeteroHeteroBonds?: string;
    useElim?: string;
    elimP1?: string;
    elimP2?: string;
    useFilterLsdRing3?: string;
    useFilterLsdRing4?: string;
    hybridizationDetectionThreshold?: number;
  };
  retrievalOptions?: { resultID?: string };
}

function validateQueryOptions(values: QueryOptions) {
  const errors: ValidationErrors = {};
  // check ELIM
  if (
    values.elucidationOptions.elimP2 !== 0 &&
    values.elucidationOptions.elimP2 < 4
  ) {
    if (!errors.elucidationOptions) {
      errors.elucidationOptions = {};
    }
    errors.elucidationOptions.elimP2 =
      'Invalid value for ELIM P2: Must be 0 (unlimited) or at least 4';
  }

  return errors;
}

export default validateQueryOptions;
