export interface Tolerance {
  [atomType: string]: number,
}

const defaultTolerance = {
  C: 1.0,
  // H: 0.1,
  // N: 2.0,
};

export default defaultTolerance;
