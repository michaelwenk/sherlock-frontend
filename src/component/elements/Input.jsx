import { useCallback } from 'react';

function Input({ type, defaultValue, onChange, className = 'Input' }) {
  const handleOnChange = useCallback(
    (e) => {
      e.stopPropagation();
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className={className}>
      <input
        type={type}
        onChange={handleOnChange}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export default Input;
