import SignalCompact from './SignalCompact';

export default interface SpectrumCompact {
  nuclei: string[];
  signals: SignalCompact[];
  meta: unknown;
}
