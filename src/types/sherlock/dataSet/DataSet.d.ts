import Assignment from './Assignment';
import Attachment from './Attachment';
import Meta from './Meta';
import SpectrumCompact from './SpectrumCompact';

export default interface DataSet {
  structure: any;
  spectrum: SpectrumCompact;
  assignment: Assignment;
  meta: Meta;
  attachment: Attachment;
}
