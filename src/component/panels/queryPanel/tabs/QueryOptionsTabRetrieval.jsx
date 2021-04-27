import { useFormikContext } from 'formik';

function QueryOptionsTabRetrieval() {
  const { setFieldValue } = useFormikContext();

  return (
    <input
      type="text"
      onChange={(e) =>
        setFieldValue('retrievalOptions.resultID', e.target.value)
      }
    />
  );
}

export default QueryOptionsTabRetrieval;
