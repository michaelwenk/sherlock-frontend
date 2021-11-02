import { Detections } from './webcase/Detections';
import ResultRecord from './webcase/ResultRecord';

export interface Result {
  queryType: string;
  time: number;
  resultRecord: ResultRecord;
  detections?: Detections;
}
