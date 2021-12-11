import './Input.scss';

import { ChangeEvent, CSSProperties, useCallback } from 'react';

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
  style?: CSSProperties;
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
  style,
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
        style={{ ...style, '--inputWidth': inputWidth } as React.CSSProperties}
      />
    </div>
  );
}

export default Input;
