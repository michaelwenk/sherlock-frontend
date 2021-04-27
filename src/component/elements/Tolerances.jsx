import { useCallback, useMemo } from 'react';
import Input from './Input';

function Tolerances({
  tolerance,
  onChangeTolerance,
  className = 'Tolerances',
}) {
  const onChangeToleranceHandler = useCallback(
    (value, atomType) => {
      const _tolerance = { ...tolerance };
      _tolerance[atomType] = Number(value);
      onChangeTolerance(_tolerance);
    },
    [onChangeTolerance, tolerance],
  );

  const inputFields = useMemo(() => {
    return Object.keys(tolerance).map((atomType) => {
      return (
        <div key={`toleranceInputField_${atomType}`}>
          <span>{atomType}: </span>
          <Input
            type="number"
            onChange={(value) =>
              onChangeToleranceHandler(value, atomType, tolerance)
            }
            defaultValue={tolerance[atomType]}
          />
        </div>
      );
    });
  }, [tolerance, onChangeToleranceHandler]);

  return <div className={className}>{inputFields}</div>;
}

export default Tolerances;
