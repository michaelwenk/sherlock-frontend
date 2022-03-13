import DereplicationOptions from './sherlock/DereplicationOptions';
import ResultRecord from './sherlock/ResultRecord';

export default interface Result {
  queryType: string;
  dereplicationOptions?: DereplicationOptions;
  resultRecord: ResultRecord;
  time?: number;
}
