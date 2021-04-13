/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';

function CheckBox({ defaultValue, onChange, title, styles }) {
  const [isChecked, setIsChecked] = useState(defaultValue);

  const handleOnChange = useCallback(() => {
    setIsChecked(!isChecked);
    onChange(!isChecked);
  }, [isChecked, onChange]);

  return (
    <div style={styles}>
      <label>
        <input type="checkbox" checked={isChecked} onChange={handleOnChange} />
        <span>{title}</span>
      </label>
    </div>
  );
}

export default CheckBox;
