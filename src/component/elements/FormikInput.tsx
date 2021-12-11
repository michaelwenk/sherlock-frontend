import './Input.scss';
import { useField } from 'formik';

interface InputProps {
  type: React.HTMLInputTypeAttribute;
  name: string;
  label?: string;
  min?: number;
  max?: number;
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
  inputWidth = '80px',
  className = 'Input',
  placeholder = '',
  ...props
}: InputProps) {
  const [field] = useField(name);

  return (
    <div className={className}>
      {label && <label>{`${label}`}</label>}
      <input
        type={type}
        placeholder={placeholder}
        min={min}
        max={max}
        style={
          {
            '--inputWidth': inputWidth,
          } as React.CSSProperties
        }
        {...field}
        {...props}
      />
    </div>
  );
}

export default FormikInput;
