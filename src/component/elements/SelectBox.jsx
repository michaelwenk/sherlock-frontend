import { useCallback } from 'react';

function SelectBox({
  selectionOptions,
  onChange,
  defaultValue,
  className = 'SelectBox',
}) {
  const handleOnChanged = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className={className}>
      <select onChange={handleOnChanged} default={defaultValue}>
        {selectionOptions.map((selectionOption) => (
          <option key={selectionOption} value={selectionOption}>
            {selectionOption}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectBox;
