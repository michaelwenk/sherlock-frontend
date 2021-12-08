import './Tolerances.scss';

import { useCallback, useMemo } from 'react';
import Input from './Input';
import generateID from '../../utils/generateID';

type InputProps = {
  tolerance: number;
  onChangeTolerance: Function;
  maxAverageDeviation: number;
  onChangeMaxAverageDeviation: Function;
  className?: string;
};

function Tolerances({
  tolerance,
  onChangeTolerance,
  maxAverageDeviation,
  onChangeMaxAverageDeviation,
  className = 'Tolerances',
}: InputProps) {
  const onChangeToleranceHandler = useCallback(
    (value: string) => {
      onChangeTolerance(Number(value));
    },
    [onChangeTolerance],
  );

  const onChangeMaxAvgDevHandler = useCallback(
    (value: string) => {
      onChangeMaxAverageDeviation(Number(value));
    },
    [onChangeMaxAverageDeviation],
  );

  const rows = useMemo(
    () => (
      <tr key={`toleranceInputField_${generateID()}`}>
        <td>
          <Input
            type="number"
            onChange={(value: string) => onChangeToleranceHandler(value)}
            defaultValue={tolerance}
            inputWidth="120px"
          />
        </td>
        <td>
          <Input
            type="number"
            onChange={(value: string) => onChangeMaxAvgDevHandler(value)}
            defaultValue={maxAverageDeviation}
            inputWidth="120px"
          />
        </td>
      </tr>
    ),
    [
      tolerance,
      maxAverageDeviation,
      onChangeToleranceHandler,
      onChangeMaxAvgDevHandler,
    ],
  );

  return (
    <div className={className}>
      <table>
        <thead>
          <tr>
            <th>Tolerance [ppm]</th>
            <th>Max. AvgDev [ppm]</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default Tolerances;
