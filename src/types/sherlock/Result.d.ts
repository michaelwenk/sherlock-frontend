import { Detections } from './Detections';
import ResultRecord from './ResultRecord';

export interface Result {
  resultRecord: ResultRecord;
  detections: Detections;
}
