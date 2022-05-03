import { CorrelationData } from 'nmr-correlation';
import DataSet from './DataSet';
import SpectrumCompact from './dataSet/SpectrumCompact';
import DetectionOptions from './DetectionOptions';
import Detections from './Detections';
import ElucidationOptions from './ElucidationOptions';
import Grouping from './Grouping';

export default interface ResultRecord {
  id?: string;
  name?: string;
  date?: string;
  dataSetList?: DataSet[];
  dataSetListSize?: number;
  previewDataSet?: DataSet;
  correlations?: CorrelationData;
  detections?: Detections;
  detectionOptions?: DetectionOptions;
  elucidationOptions?: ElucidationOptions;
  grouping?: Grouping;
  querySpectrum?: SpectrumCompact;
  // nmriumDataJsonParts?: string[];
}
