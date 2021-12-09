import { Spectra } from '@michaelwenk/nmrium';
import { Types } from 'nmr-correlation';
export interface NMRiumData {
  spectra?: Spectra;
  correlations?: Types.CorrelationData;
}
