import { Types } from 'nmr-correlation';
import { Spectra } from 'nmr-correlation/lib/types';

export interface NMRiumData {
  spectra: Spectra;
  correlations: Types.CorrelationData;
}
