import { useCallback } from 'react';

type InputProps = {
  selectionOptions: Array<string>;
  defaultValue: string;
  onChange: Function;
  className?: string;
};

function SelectBox({
  selectionOptions,
  onChange,
  defaultValue,
  className = 'SelectBox',
}: InputProps) {
  const handleOnChanged = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className={className}>
      <select onChange={handleOnChanged} defaultValue={defaultValue}>
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
