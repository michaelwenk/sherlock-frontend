import { Detections } from './webcase/Detections';
import ResultRecord from './webcase/ResultRecord';

export interface Result {
  queryType: string;
  resultRecord: ResultRecord;
  detections?: Detections;
  time?: number;
}
