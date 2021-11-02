import { DataSet } from './DataSet';

export default interface ResultRecord {
  id: string;
  name: string;
  date: string;
  dataSetList: DataSet[];
  dataSetListSize: number;
  previewDataSet: DataSet;
}
