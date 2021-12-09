import { Types } from 'nmr-correlation';
import { DataSet } from './DataSet';
import { Detections } from './Detections';

export default interface ResultRecord {
  id: string;
  name: string;
  date: string;
  dataSetList: DataSet[];
  dataSetListSize: number;
  previewDataSet: DataSet;
  correlations: Types.CorrelationData;
  detections: Detections;
}
