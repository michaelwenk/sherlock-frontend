import './Input.scss';
import { useFormikContext } from 'formik';
import { useCallback } from 'react';

interface InputProps {
  type: 'number' | 'string';
  name: string;
  label?: string;
  min?: number;
  max?: number;
  inPercentage?: boolean;
  inputWidth?: string;
  className?: string;
  placeholder?: string;
}

function FormikInput({
  type,
  name,
  label,
  min,
  max,
  inPercentage = false,
  inputWidth = '80px',
  className = 'Input',
  placeholder = '',
  ...props
}: InputProps) {
  const { setFieldValue, getFieldMeta } = useFormikContext();
  const fieldMeta = getFieldMeta(name);

  const onChange = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (type === 'number') {
        let value = Number(e.target.value);
        if (inPercentage) {
          value = value / 100;
        }
        if (min !== undefined && max !== undefined) {
          let minValue = min;
          let maxValue = max;
          if (inPercentage) {
            minValue = minValue / 100;
            maxValue = maxValue / 100;
          }
          if (value >= minValue && value <= maxValue) {
            setFieldValue(name, value);
          } else if (value < minValue) {
            setFieldValue(name, minValue);
          } else if (value > maxValue) {
            setFieldValue(name, maxValue);
          }
        } else {
          setFieldValue(name, value);
        }
      } else {
        setFieldValue(name, e.target.value as string);
      }
    },
    [inPercentage, max, min, name, setFieldValue, type],
  );

  return (
    <div className={className}>
      {label && <label>{`${label}`}</label>}
      <input
        type={type === 'number' ? 'number' : 'text'}
        placeholder={placeholder}
        min={min}
        max={max}
        style={
          {
            '--inputWidth': inputWidth,
          } as React.CSSProperties
        }
        value={
          type === 'number'
            ? inPercentage
              ? (fieldMeta.value as number) * 100
              : (fieldMeta.value as number)
            : (fieldMeta.value as string)
        }
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

export default FormikInput;
