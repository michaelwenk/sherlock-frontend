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
      <table>
        <thead>
          <tr>
            <th>Tolerance [ppm]</th>
            <th>Max. AvgDev [ppm]</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Input
                type="number"
                onChange={(value: string) => onChangeToleranceHandler(value)}
                defaultValue={values.dereplicationOptions.shiftTolerance}
                inputWidth="120px"
              />
            </td>
            <td>
              <Input
                type="number"
                onChange={(value: string) => onChangeMaxAvgDevHandler(value)}
                defaultValue={values.dereplicationOptions.maxAverageDeviation}
                inputWidth="120px"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <CheckBox
        defaultValue={values.dereplicationOptions.checkMultiplicity}
        onChange={(isChecked) =>
          setFieldValue('dereplicationOptions.checkMultiplicity', isChecked)
        }
        label="Check Multiplicity"
      />
      <CheckBox
        defaultValue={values.dereplicationOptions.checkEquivalencesCount}
        onChange={(isChecked) =>
          setFieldValue(
            'dereplicationOptions.checkEquivalencesCount',
            isChecked,
          )
        }
        label="Check Equivalences Count"
      />
      <CheckBox
        defaultValue={values.dereplicationOptions.useMF}
        onChange={(isChecked) =>
          setFieldValue('dereplicationOptions.useMF', isChecked)
        }
        label="Check Molecular Formula"
      />
    </div>
  );
}

export default QueryTabDereplication;
