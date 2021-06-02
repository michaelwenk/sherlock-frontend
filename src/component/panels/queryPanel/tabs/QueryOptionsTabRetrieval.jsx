import { useFormikContext } from 'formik';
import Input from '../../../elements/Input';

function QueryOptionsTabRetrieval() {
  const { setFieldValue } = useFormikContext();

  return (
    <Input
      type="text"
      onChange={(value) => setFieldValue('retrievalOptions.resultID', value)}
      defaultValue=""
      label="Result ID"
    />
  );
}

export default QueryOptionsTabRetrieval;
