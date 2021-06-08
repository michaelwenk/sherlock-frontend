import { ChangeEvent, useCallback } from 'react';

type InputProps = {
  type: string;
  defaultValue: string | number;
  onChange: Function;
  label?: string;
  className?: string;
};

function Input({
  type,
  defaultValue,
  onChange,
  label = '',
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
        />
      </label>
    </div>
  );
}

export default Input;
