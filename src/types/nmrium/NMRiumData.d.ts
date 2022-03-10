import { Spectra } from '@michaelwenk/nmrium';
import { CorrelationData } from 'nmr-correlation';
export default interface NMRiumData {
  spectra?: Spectra;
  correlations?: CorrelationData;
}
