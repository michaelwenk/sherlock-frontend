import { useCallback } from 'react';

function Input({
  type,
  defaultValue,
  onChange,
  label = '',
  className = 'Input',
}) {
  const handleOnChange = useCallback(
    (e) => {
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
