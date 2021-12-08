import './Input.scss';

import { ChangeEvent, useCallback } from 'react';

type InputProps = {
  type: React.HTMLInputTypeAttribute;
  defaultValue: string | number;
  onChange: Function;
  label?: string;
  min?: number;
  max?: number;
  inputWidth?: string;
  className?: string;
  placeholder?: string;
};

function Input({
  type,
  defaultValue,
  onChange,
  label,
  min,
  max,
  inputWidth = '80px',
  className = 'Input',
  placeholder = '',
}: InputProps) {
  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();

      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className={className}>
      {label && <label>{`${label}`}</label>}
      <input
        type={type}
        onChange={handleOnChange}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        max={max}
        style={
          {
            '--inputWidth': inputWidth,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

export default Input;
