// error colors in priority order
const ErrorColors: Array<{ key: string; color: string }> = [
  { key: 'outOfLimit', color: 'red' },
  { key: 'ambiguousAttachment', color: 'orange' },
  { key: 'notAttached', color: 'blue' },
  { key: 'incomplete', color: 'red' },
];

const Errors = ErrorColors.map((errorColor) => errorColor.key);

const Hybridizations: Array<{ key: string; label: string; value: string }> = [
  {
    key: '-',
    label: '',
    value: '',
  },
  {
    key: 'sp',
    label: 'sp',
    value: 'SP',
  },
  {
    key: 'sp2',
    label: 'sp2',
    value: 'SP2',
  },
  {
    key: 'sp3',
    label: 'sp3',
    value: 'SP3',
  },
];

export { Errors, ErrorColors, Hybridizations };