import { Spectra } from './nmrium/nmrium';
import { Types } from 'nmr-correlation';

export interface Data {
  spectra: Spectra;
  correlations: Types.CorrelationData;
}
