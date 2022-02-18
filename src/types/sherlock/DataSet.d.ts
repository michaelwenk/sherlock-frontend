import Assignment from './Assignment';
import Meta from './Meta';

export default interface DataSet {
  structure: any;
  spectrum: any;
  assignment: Assignment;
  meta: Meta;
  attachment: any;
}
