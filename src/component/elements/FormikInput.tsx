import './FormikInput.scss';
import { useFormikContext } from 'formik';
import { useCallback, useMemo } from 'react';

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
  inPercentage = false,
  inputWidth = '80px',
  className = 'Input',
  placeholder = '',
  ...props
}: InputProps) {
  const { setFieldValue, getFieldMeta } = useFormikContext();
  const fieldMeta = getFieldMeta(name);

  const hasErrors = useMemo(
    () => fieldMeta.error !== undefined,
    [fieldMeta.error],
  );

  const onChange = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.target.value !== '') {
        if (type === 'number') {
          let value = Number(e.target.value);
          if (inPercentage) {
            value = value / 100;
          }
          setFieldValue(name, value);
        } else {
          setFieldValue(name, e.target.value as string);
        }
      } else {
        setFieldValue(name, e.target.value as string);
      }
    },
    [inPercentage, name, setFieldValue, type],
  );

  return (
    <div className={className} style={{ color: hasErrors ? 'red' : 'inherit' }}>
      {label && <label>{label}</label>}
      <input
        type={type === 'number' ? 'number' : 'text'}
        placeholder={placeholder}
        style={
          {
            '--inputWidth': inputWidth,
          } as React.CSSProperties
        }
        value={
          fieldMeta.value === ''
            ? ''
            : type === 'number'
            ? inPercentage
              ? ((fieldMeta.value as number) * 100).toFixed(0)
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
