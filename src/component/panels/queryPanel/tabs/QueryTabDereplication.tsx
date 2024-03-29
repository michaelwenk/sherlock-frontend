import './QueryTabDereplication.scss';

import { useFormikContext } from 'formik';
import CheckBox from '../../../elements/CheckBox';
import QueryOptions from '../../../../types/QueryOptions';
import FormikInput from '../../../elements/FormikInput';
import ErrorSymbol from '../../../elements/ErrorSymbol';
import queryTypes from '../../../../constants/queryTypes';
import Button from '../../../elements/Button';
import capitalize from '../../../../utils/capitalize';
import { useData } from '../../../../context/DataContext';
import { memo, useMemo } from 'react';

function QueryTabDereplication() {
  const { isRequesting } = useData();
  const { errors, values, setFieldValue, submitForm } =
    useFormikContext<QueryOptions>();

  return useMemo(
    () => (
      <div className="query-options-tab-dereplication-container">
        <div className="options-tab-dereplication-table-container">
          <table>
            <tbody>
              <tr>
                <td>Shift tolerance (ppm)</td>
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
                    name="dereplicationOptions.maximumAverageDeviation"
                  />
                </td>
                <td>
                  {errors.dereplicationOptions?.maximumAverageDeviation && (
                    <ErrorSymbol
                      message={
                        errors.dereplicationOptions.maximumAverageDeviation
                      }
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
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="button-container">
            <Button
              onClick={() => {
                setFieldValue('queryType', queryTypes.dereplication);
                submitForm();
              }}
              child={capitalize(queryTypes.dereplication)}
              disabled={isRequesting || Object.keys(errors).length > 0}
              style={{
                color:
                  isRequesting || Object.keys(errors).length > 0
                    ? 'grey'
                    : 'inherit',
              }}
            />
          </div>
        </div>
      </div>
    ),
    [
      errors,
      isRequesting,
      setFieldValue,
      submitForm,
      values.dereplicationOptions.checkEquivalencesCount,
      values.dereplicationOptions.checkMultiplicity,
      values.dereplicationOptions.useMF,
    ],
  );
}

export default memo(QueryTabDereplication);
