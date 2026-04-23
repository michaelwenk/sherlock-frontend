import { NMRiumState } from 'nmrium';
import Result from './Result';
import ResultRecord from './sherlock/ResultRecord';

export default interface DataState {
  nmriumState?: Partial<NMRiumState>;
  resultData?: Result;
  resultDataDB?: ResultRecord[];
  isRequesting: boolean;
}
