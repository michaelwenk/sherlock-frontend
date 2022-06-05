import './CheckBox.scss';
import { useCallback, useMemo, useState } from 'react';

type InputProps = {
  defaultValue: boolean;
  onChange: Function;
  label?: string;
  className?: string;
};

function CheckBox({
  defaultValue,
  onChange,
  label,
  className = 'CheckBox',
  ...props
}: InputProps) {
  const [isChecked, setIsChecked] = useState<boolean>(defaultValue);

  const handleOnChange = useCallback(() => {
    setIsChecked(!isChecked);
    onChange(!isChecked);
  }, [isChecked, onChange]);

  return useMemo(
    () => (
      <div className={className}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleOnChange}
          {...props}
        />
        <label>{label}</label>
      </div>
    ),
    [className, handleOnChange, isChecked, label, props],
  );
}

export default CheckBox;
