import { CorrelationData } from 'nmr-correlation';
import { NMRiumState } from 'nmrium';

const initialNMRiumState: Partial<NMRiumState> = {
  data: {
    spectra: [],
    correlations: {} as CorrelationData,
    molecules: [],
  },
};

export default initialNMRiumState;
