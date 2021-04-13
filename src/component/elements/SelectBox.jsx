import { useCallback } from 'react';

function SelectBox({ selectionOptions, onChange, defaultValue }) {
  const handleOnChanged = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <select onChange={handleOnChanged} default={defaultValue}>
      {selectionOptions.map((selectionOption) => (
        <option key={selectionOption} value={selectionOption}>
          {selectionOption}
        </option>
      ))}
    </select>
  );
}

export default SelectBox;
