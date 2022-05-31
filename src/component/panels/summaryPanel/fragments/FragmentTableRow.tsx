import { memo, useMemo } from 'react';
import DataSet from '../../../../types/sherlock/dataSet/DataSet';
import SpectrumCompact from '../../../../types/sherlock/dataSet/SpectrumCompact';
import generateID from '../../../../utils/generateID';
import CheckBox from '../../../elements/CheckBox';
import StructureView from '../../../elements/StructureView';

interface InputProps {
  index: number;
  fragment: DataSet;
  querySpectrum: SpectrumCompact;
  // eslint-disable-next-line no-unused-vars
  onChangeHandler: (index: number, value: boolean) => void;
}

function FragmentsTableRow({
  index,
  fragment,
  querySpectrum,
  onChangeHandler,
}: InputProps) {
  return useMemo(
    () => (
      <tr key={generateID()}>
        <td>{index}</td>
        <td style={{ width: '50%' }}>
          <StructureView dataSet={fragment} querySpectrum={querySpectrum} />
        </td>
        <td style={{ width: '40%' }}>
          <p>{fragment.attachment.averageDeviation.toFixed(2)}</p>
        </td>
        <td style={{ width: '10%' }}>
          <CheckBox
            defaultValue={fragment.attachment.include}
            onChange={(value: boolean) => onChangeHandler(index, value)}
          />
        </td>
      </tr>
    ),
    [fragment, index, onChangeHandler, querySpectrum],
  );
}

export default memo(FragmentsTableRow);
