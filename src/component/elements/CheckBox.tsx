import { useCallback, useState } from 'react';

type InputProps = {
  defaultValue: boolean,
  onChange: Function,
  label?: string,
  className?: string,
}

function CheckBox({ defaultValue, onChange, label, className = 'CheckBox' } : InputProps) {
  const [isChecked, setIsChecked] = useState<boolean>(defaultValue);

  const handleOnChange = useCallback(() => {
    setIsChecked(!isChecked);
    onChange(!isChecked);
  }, [isChecked, onChange]);

  return (
    <div className={className}>
      <span>
        <input type="checkbox" checked={isChecked} onChange={handleOnChange} />
        <label>{label}</label>
      </span>
    </div>
  );
}

export default CheckBox;
