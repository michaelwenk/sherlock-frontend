import { useCallback } from 'react';

function Input({ type, defaultValue, onChange, styles }) {
  const handleOnChange = useCallback(
    (e) => {
      e.stopPropagation();
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div style={styles}>
      <input
        type={type}
        onChange={handleOnChange}
        defaultValue={defaultValue}
      />
    </div>
  );
}

export default Input;
