/** @jsxImportSource @emotion/react */
import CheckBox from '../../../elements/CheckBox';
import { useFormikContext } from 'formik';

function QueryTabElucidation() {
  const { values, setFieldValue } = useFormikContext();

  return (
    <CheckBox
      defaultValue={values.elucidationOptions.allowHeteroHeteroBonds}
      onChange={(isChecked) =>
        setFieldValue('elucidationOptions.allowHeteroHeteroBonds', isChecked)
      }
      title="Allow Hetero-Hetero Bonds"
    />
  );
}

export default QueryTabElucidation;
