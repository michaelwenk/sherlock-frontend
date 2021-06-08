import { Types } from 'nmr-correlation';

export interface File {
  binary: ArrayBuffer;
  name: string;
  extension?: string;
}

export interface Data1D {
  y: Array<number>;
  x: Array<number>;
  re: Array<number>;
  im: Array<number>;
}

export interface Display1D {
  name: string;
  color: string;
  isVisible: boolean;
  isPeaksMarkersVisible: boolean;
  isRealSpectrumVisible: boolean;
  isVisibleInDomain: boolean;
}

export interface Info1D {
  nucleus: Array<string>;
  isFid: boolean;
  isComplex: boolean;
  dimension: number;
  isFt: boolean;
}
export interface Peak1D {
  id: string;
  delta: number;
  originDelta: number;
  width: number;
}
export interface Peaks1D {
  values: Array<Partial<Peak1D>>;
  options: any;
}
export interface Integral1D {
  id: string;
  originFrom: number;
  originTo: number;
  from: number;
  to: number;
  absolute: number;
  integral: number;
  kind: string;
}
export interface Integrals1D {
  values: Array<Partial<Integral1D>>;
  options: Partial<{ sum: number }>;
}

export interface Signal1D {
  id: string;
  kind: string;
  originDelta?: number;
  delta: number;
  multiplicity: string;
  peak?: Array<Partial<{ x: number; intensity: number; width: number }>>;
}
export interface Range {
  id: string;
  originFrom?: number;
  originTo?: number;
  from: number;
  to: number;
  absolute: number;
  integral: number;
  kind: string;
  signal?: Array<Partial<Signal1D>>;
}

export interface Ranges {
  values: Array<Partial<Range>>;
  options: Partial<{ sum: number }>;
}

export interface Source {
  jcampURL: string;
  file: File;
}

export interface Datum1D {
  id: string | number;
  source?: Partial<Source>;
  display?: Partial<Display1D>;
  info: Partial<Info1D>;
  originalInfo?: Partial<Info1D>;
  meta?: any;
  data: Data1D;
  originalData?: Data1D;
  peaks?: Peaks1D;
  integrals?: Integrals1D;
  ranges: Ranges;
  filters?: any;
}

export interface Data2D {
  z: Array<Array<number>>;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface ContourOptions2D {
  positive: {
    contourLevels: [number, number];
    numberOfLayers: number;
  };
  negative: {
    contourLevels: [number, number];
    numberOfLayers: number;
  };
}

export interface Display2D {
  name: string;
  positiveColor: string;
  negativeColor: string;
  isVisible: boolean;
  isPositiveVisible: boolean;
  isNegativeVisible: boolean;
  contourOptions: ContourOptions2D;
  isVisibleInDomain: boolean;
}

export interface Info2D {
  nucleus: Array<string>;
  isFid: boolean;
  isComplex: boolean;
  dimension: number;
  isFt: boolean;
}

export interface Signal2D {
  id: number;
  peak: any;
  x: Partial<{
    originDelta: number;
    delta: number;
    diaID: any;
  }>;
  y: Partial<{
    originDelta: number;
    delta: number;
    diaID: any;
  }>;
  kind: string;
}

export interface Zone {
  id: number;
  x: Partial<{ from: number; to: number }>;
  y: Partial<{ from: number; to: number }>;
  signal: Array<Signal2D>;
  kind: string;
}

export interface Zones {
  values: Array<Partial<Zone>>;
  options?: Partial<{ sum: number }>;
}

export interface Datum2D {
  id: string | number;
  source?: Partial<Source>;
  display?: Display2D;
  info: Partial<Info2D>;
  originalInfo?: Partial<Info2D>;
  meta?: any;
  data: Data2D;
  originalData?: Data2D;
  zones: Zones;
  filters?: any;
  processingController?: any;
}

export type Spectra = Array<Partial<Datum1D> | Partial<Datum2D>>;

export interface State {
  data: Spectra;
  contours: any;
  tempData: any;
  xDomain: Array<number>;
  yDomain: Array<number>;
  yDomains: any;
  xDomains: any;
  originDomain: any;
  integralsYDomains: any;
  originIntegralYDomain: any;
  activeTab: any;
  width: any;
  height: any;
  margin: Partial<{ top: number; right: number; bottom: number; left: number }>;
  activeSpectrum: any;
  mode: string;
  zoomFactor: Partial<{ scale: number }>;
  integralZoomFactor: Partial<{ scale: number }>;
  molecules: Array<any>;
  verticalAlign: Partial<{
    flag: boolean;
    stacked: boolean;
    value: number;
  }>;
  history: Partial<{
    past: Array<any>;
    present: any;
    future: Array<any>;
    hasUndo: boolean;
    hasRedo: boolean;
  }>;
  isLoading: boolean;
  preferences: any;
  keysPreferences: any;
  displayerMode: any;
  tabActiveSpectrum: any;
  spectraAnalysis: any;
  displayerKey: any;
  correlations: Types.CorrelationData;
  ZoomHistory: any;
  overDisplayer: boolean;

  toolOptions: {
    selectedTool: any;
    selectedOptionPanel: any;

    data: {
      baseLineZones: any;
      exclusionZones: {
        [key: string]: Array<{ id: string; from: number; to: number }>;
      };
      pivot: number;
      zonesNoiseFactor: number;
    };
  };
}
