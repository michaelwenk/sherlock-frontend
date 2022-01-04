import './QueryTabDereplication.scss';

import { useFormikContext } from 'formik';
import CheckBox from '../../../elements/CheckBox';
import QueryOptions from '../../../../types/QueryOptions';
import FormikInput from '../../../elements/FormikInput';
import ErrorSymbol from '../../../elements/ErrorSymbol';

function QueryTabDereplication() {
  const { errors, values, setFieldValue } = useFormikContext<QueryOptions>();

  return (
    <div className="query-options-tab-dereplication-container">
      <table>
        <tbody>
          <tr>
            <td>Tolerance (ppm)</td>
            <td>
              <FormikInput
                type="number"
                name="dereplicationOptions.shiftTolerance"
              />
            </td>
            <td>
              {errors.dereplicationOptions?.shiftTolerance && (
                <ErrorSymbol
                  message={errors.dereplicationOptions.shiftTolerance}
                />
              )}
            </td>
          </tr>
          <tr>
            <td>Maximum average deviation (ppm)</td>
            <td>
              <FormikInput
                type="number"
                name="dereplicationOptions.maxAverageDeviation"
              />
            </td>
            <td>
              {errors.dereplicationOptions?.maxAverageDeviation && (
                <ErrorSymbol
                  message={errors.dereplicationOptions.maxAverageDeviation}
                />
              )}
            </td>
          </tr>
          <tr>
            <td>Check Multiplicity</td>
            <td>
              <CheckBox
                defaultValue={values.dereplicationOptions.checkMultiplicity}
                onChange={(isChecked) =>
                  setFieldValue(
                    'dereplicationOptions.checkMultiplicity',
                    isChecked,
                  )
                }
                // label="Check Multiplicity"
              />
            </td>
          </tr>
          <tr>
            <td>Check Equivalences Count</td>
            <td>
              <CheckBox
                defaultValue={
                  values.dereplicationOptions.checkEquivalencesCount
                }
                onChange={(isChecked) =>
                  setFieldValue(
                    'dereplicationOptions.checkEquivalencesCount',
                    isChecked,
                  )
                }
                // label="Check Equivalences Count"
              />
            </td>
          </tr>
          <tr>
            <td>Check Molecular Formula</td>
            <td>
              <CheckBox
                defaultValue={values.dereplicationOptions.useMF}
                onChange={(isChecked) =>
                  setFieldValue('dereplicationOptions.useMF', isChecked)
                }
                // label="Check Molecular Formula"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default QueryTabDereplication;
