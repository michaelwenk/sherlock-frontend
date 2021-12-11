import { useField } from 'formik';

type InputProps = {
  name: string;
  label: string;
  className?: string;
};

function FormikCheckBox({
  name,
  label,
  className = 'CheckBox',
  ...props
}: InputProps) {
  const [field] = useField(name);

  return (
    <div className={className}>
      <input type="checkbox" {...field} checked={field.value} {...props} />
      <label>{label}</label>
    </div>
  );
}

export default FormikCheckBox;
