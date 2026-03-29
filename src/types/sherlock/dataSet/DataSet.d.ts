import Assignment from './Assignment';
import Attachment from './Attachment';
import Meta from './Meta';
import SpectrumCompact from './SpectrumCompact';

export default interface DataSet {
  meta: Meta;
  attachment: Attachment;
  structure?: string;
  spectrum?: SpectrumCompact;
  assignment?: Assignment;
}
