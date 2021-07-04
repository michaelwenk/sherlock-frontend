import { ChangeEvent, useCallback } from 'react';

type InputProps = {
  type: string;
  defaultValue: string | number;
  onChange: Function;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
};

function Input({
  type,
  defaultValue,
  onChange,
  label = '',
  min,
  max,
  step,
  className = 'Input',
}: InputProps) {
  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className={className}>
      <label>
        {`${label}\t`}
        <input
          type={type}
          onChange={handleOnChange}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
        />
      </label>
    </div>
  );
}

export default Input;
