import ResultRecord from './sherlock/ResultRecord';

export default interface Result {
  queryType: string;
  resultRecord: ResultRecord;
  time?: number;
}
