import './SelectBox.scss';
import { CSSProperties, useCallback, useMemo } from 'react';

type InputProps = {
  values: string[] | number[];
  defaultValue: string | number;
  onChange: Function;
  className?: string;
  style?: CSSProperties;
};

function SelectBox({
  values,
  onChange,
  defaultValue,
  className = 'SelectBox',
  style,
}: InputProps) {
  const handleOnChanged = useCallback(
    (e) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return useMemo(
    () => (
      <select
        className={className}
        onChange={handleOnChanged}
        defaultValue={defaultValue}
        style={style}
      >
        {values.map((value: string | number) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    ),
    [className, defaultValue, handleOnChanged, style, values],
  );
}

export default SelectBox;
