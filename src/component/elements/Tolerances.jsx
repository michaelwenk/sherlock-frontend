/** @jsxImportSource @emotion/react */

import { useCallback, useMemo } from 'react';

function Tolerances({ tolerance, onChangeTolerance }) {
  const onChangeToleranceHandler = useCallback(
    (e, atomType) => {
      e.stopPropagation();
      const _tolerance = { ...tolerance };
      _tolerance[atomType] = Number(e.target.value);
      onChangeTolerance(_tolerance);
    },
    [onChangeTolerance, tolerance],
  );

  const inputFields = useMemo(() => {
    return Object.keys(tolerance).map((atomType) => {
      console.log(tolerance[atomType]);
      return (
        <div key={`toleranceInputField_${atomType}`}>
          <span>{atomType}: </span>
          <input
            type="number"
            onChange={(e) => onChangeToleranceHandler(e, atomType, tolerance)}
            defaultValue={tolerance[atomType]}
          />
        </div>
      );
    });
  }, [tolerance, onChangeToleranceHandler]);

  return <div>{inputFields}</div>;
}

export default Tolerances;
