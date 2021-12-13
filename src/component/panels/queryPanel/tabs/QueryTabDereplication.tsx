import { useFormikContext } from 'formik';
import CheckBox from '../../../elements/CheckBox';
import { QueryOptions } from '../../../../types/QueryOptions';
import Input from '../../../elements/Input';
import { useCallback } from 'react';

function QueryTabDereplication() {
  const { values, setFieldValue } = useFormikContext<QueryOptions>();

  const onChangeToleranceHandler = useCallback(
    (value: string) => {
      setFieldValue('dereplicationOptions.shiftTolerance', Number(value));
    },
    [setFieldValue],
  );

  const onChangeMaxAvgDevHandler = useCallback(
    (value: string) => {
      setFieldValue('dereplicationOptions.maxAverageDeviation', Number(value));
    },
    [setFieldValue],
  );

  return (
    <div>
      <table style={{ textAlign: 'left', marginTop: '5px' }}>
        <tbody>
          <tr>
            <td>Tolerance (ppm)</td>
            <td>
              <Input
                type="number"
                onChange={(value: string) => onChangeToleranceHandler(value)}
                defaultValue={values.dereplicationOptions.shiftTolerance}
                // label="Tolerance [ppm]"
                inputWidth="120px"
              />
            </td>
          </tr>
          <tr>
            <td>Maximum average deviation (ppm)</td>
            <td>
              <Input
                type="number"
                onChange={(value: string) => onChangeMaxAvgDevHandler(value)}
                defaultValue={values.dereplicationOptions.maxAverageDeviation}
                // label="Max. Avg. Deviation [ppm]"
                inputWidth="120px"
              />
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
