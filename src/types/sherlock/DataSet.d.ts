import Assignment from './Assignment';
import Attachment from './Attachment';
import Meta from './Meta';

export default interface DataSet {
  structure: any;
  spectrum: any;
  assignment: Assignment;
  meta: Meta;
  attachment: Attachment;
}
