import { useFormikContext } from 'formik';
import Input from '../../../elements/Input';
import { QueryOptions } from '../QueryPanel';

function QueryOptionsTabRetrieval() {
  const { setFieldValue } = useFormikContext<QueryOptions>();

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
