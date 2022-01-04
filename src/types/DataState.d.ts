import NMRiumData from './nmrium/NMRiumData';
import Result from './Result';
import ResultRecord from './sherlock/ResultRecord';

export default interface DataState {
  nmriumData?: NMRiumData;
  resultData?: Result;
  resultDataDB?: ResultRecord[];
}
