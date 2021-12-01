import { Detections } from './sherlock/Detections';
import ResultRecord from './sherlock/ResultRecord';

export interface Result {
  queryType: string;
  resultRecord: ResultRecord;
  detections?: Detections;
  time?: number;
}
