import { useCallback } from 'react';

type InputProps = {
  values: string[] | number[];
  defaultValue: string | number;
  onChange: Function;
  className?: string;
};

function SelectBox({
  values,
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
    <select
      className={className}
      onChange={handleOnChanged}
      defaultValue={defaultValue}
    >
      {values.map((value: string | number) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}

export default SelectBox;
