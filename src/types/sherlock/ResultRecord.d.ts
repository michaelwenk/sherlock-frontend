import { Types } from 'nmr-correlation';
import { DataSet } from './DataSet';
import DetectionOptions from './DetectionOptions';
import { Detections } from './Detections';
import ElucidationOptions from './ElucidationOptions';
import Grouping from './Grouping';

export default interface ResultRecord {
  id?: string;
  name?: string;
  date?: string;
  dataSetList?: DataSet[];
  dataSetListSize?: number;
  previewDataSet?: DataSet;
  correlations?: Types.CorrelationData;
  detections?: Detections;
  detectionOptions?: DetectionOptions;
  elucidationOptions?: ElucidationOptions;
  grouping?: Grouping;
}
