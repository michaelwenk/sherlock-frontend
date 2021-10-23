import { useFormikContext } from 'formik';
import { QueryOptions } from '../../../../types/QueryOptions';
import Input from '../../../elements/Input';

function QueryTabRetrieval() {
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

export default QueryTabRetrieval;
