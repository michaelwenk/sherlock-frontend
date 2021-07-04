import { QueryOptions } from '../types/QueryOptions';

export interface ShiftToleranceError {
  [atomType: string]: string;
}

export interface ValidationErrors {
  dereplicationOptions?: {
    shiftTolerances?: ShiftToleranceError;
    checkMultiplicity?: string;
    checkEquivalencesCount?: string;
    useMF?: string;
  };
  elucidationOptions?: {
    allowHeteroHeteroBonds?: string;
    useElim?: string;
    elimP1?: string;
    elimP2?: string;
    hmbcP3?: string;
    hmbcP4?: string;
    cosyP3?: string;
    cosyP4?: string;
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
  // check HMBC
  if (values.elucidationOptions.hmbcP3 < 2) {
    if (!errors.elucidationOptions) {
      errors.elucidationOptions = {};
    }
    errors.elucidationOptions.hmbcP3 =
      'Invalid value for HMBC P3: Must be 2 or greater';
  }
  if (
    values.elucidationOptions.hmbcP4 !== 0 &&
    values.elucidationOptions.hmbcP4 < values.elucidationOptions.hmbcP3
  ) {
    if (!errors.elucidationOptions) {
      errors.elucidationOptions = {};
    }
    errors.elucidationOptions.hmbcP4 =
      'Invalid value for HMBC P4: Must be equal to HMBC P3 or greater';
  }
  // check COSY
  if (values.elucidationOptions.cosyP3 < 3) {
    if (!errors.elucidationOptions) {
      errors.elucidationOptions = {};
    }
    errors.elucidationOptions.hmbcP3 =
      'Invalid value for COSY P3: Must be 3 or greater';
  }
  if (
    values.elucidationOptions.cosyP4 !== 0 &&
    values.elucidationOptions.cosyP4 < values.elucidationOptions.cosyP3
  ) {
    if (!errors.elucidationOptions) {
      errors.elucidationOptions = {};
    }
    errors.elucidationOptions.cosyP4 =
      'Invalid value for COSY P4: Must be equal to COSY P3 or greater';
  }

  console.log(values);
  console.log(errors);

  return errors;
}

export default validateQueryOptions;
