import { CorrelationData } from 'nmr-correlation';
import DataSet from './DataSet';
import SpectrumCompact from './dataSet/SpectrumCompact';
import DetectionOptions from './DetectionOptions';
import Detections from './Detections';
import ElucidationOptions from './ElucidationOptions';
import Grouping from './Grouping';
import PredictionOptions from './PredictionOptions';

export default interface ResultRecord {
  id?: string;
  name?: string;
  date?: string;
  dataSetList?: DataSet[];
  dataSetListSize?: number;
  previewDataSet?: DataSet;
  correlations?: CorrelationData;
  detected?: boolean;
  detections?: Detections;
  detectionOptions?: DetectionOptions;
  elucidationOptions?: ElucidationOptions;
  predictionOptions?: PredictionOptions;
  grouping?: Grouping;
  querySpectrum?: SpectrumCompact;
}
