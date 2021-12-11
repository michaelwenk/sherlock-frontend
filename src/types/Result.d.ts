import ResultRecord from './sherlock/ResultRecord';

export interface Result {
  queryType: string;
  resultRecord: ResultRecord;
  time?: number;
}
