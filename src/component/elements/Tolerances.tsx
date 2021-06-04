import { useCallback, useMemo } from 'react';
import { Tolerance } from '../../constants/defaultTolerance';
import Input from './Input';

type InputProps = {
  tolerance: Tolerance,
  onChangeTolerance: Function,
  className?: string,
}

function Tolerances({
  tolerance,
  onChangeTolerance,
  className = 'Tolerances',
} : InputProps) {
  const onChangeToleranceHandler = useCallback(
    (value: string, atomType: string) => {
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
          <span>
            <label>Tolerance value [ppm]: </label>
            <Input
              type="number"
              onChange={(value: string) =>
                onChangeToleranceHandler(value, atomType)
              }
              defaultValue={tolerance[atomType]}
              label={atomType}
            />
          </span>
        </div>
      );
    });
  }, [tolerance, onChangeToleranceHandler]);

  return <div className={className}>{inputFields}</div>;
}

export default Tolerances;
