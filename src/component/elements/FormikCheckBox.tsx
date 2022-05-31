import './CheckBox.scss';
import { useField } from 'formik';
import { useMemo } from 'react';

type InputProps = {
  name: string;
  label?: string;
  className?: string;
};

function FormikCheckBox({
  name,
  label = '',
  className = 'CheckBox',
  ...props
}: InputProps) {
  const [field] = useField(name);

  return useMemo(
    () => (
      <div className={className}>
        <input type="checkbox" {...field} checked={field.value} {...props} />
        <label>{label}</label>
      </div>
    ),
    [className, field, label, props],
  );
}

export default FormikCheckBox;
