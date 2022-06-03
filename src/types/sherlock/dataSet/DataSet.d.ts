import Assignment from './Assignment';
import Attachment from './Attachment';
import Meta from './Meta';
import SpectrumCompact from './SpectrumCompact';

export default interface DataSet {
  meta: Meta;
  attachment: Attachment;
  structure?: any;
  spectrum?: SpectrumCompact;
  assignment?: Assignment;
}
