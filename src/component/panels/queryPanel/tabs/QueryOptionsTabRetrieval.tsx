import { useFormikContext } from 'formik';
import { QueryOptions } from '../../../../types/QueryOptions';
import Input from '../../../elements/Input';

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
