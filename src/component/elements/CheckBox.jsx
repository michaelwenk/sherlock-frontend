import { useCallback, useState } from 'react';

function CheckBox({ defaultValue, onChange, title, className = 'CheckBox' }) {
  const [isChecked, setIsChecked] = useState(defaultValue);

  const handleOnChange = useCallback(() => {
    setIsChecked(!isChecked);
    onChange(!isChecked);
  }, [isChecked, onChange]);

  return (
    <div className={className}>
      <span>
        <input type="checkbox" checked={isChecked} onChange={handleOnChange} />
        <label>{title}</label>
      </span>
    </div>
  );
}

export default CheckBox;
