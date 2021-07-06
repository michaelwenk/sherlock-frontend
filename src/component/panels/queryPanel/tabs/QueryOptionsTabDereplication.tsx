import Tolerances from '../../../elements/Tolerances';
import { useFormikContext } from 'formik';
import CheckBox from '../../../elements/CheckBox';
import { Tolerance } from '../../../../constants/defaultTolerance';
import Input from '../../../elements/Input';
import { QueryOptions } from '../../../../types/QueryOptions';

function QueryTabDereplication() {
  const { values, setFieldValue } = useFormikContext<QueryOptions>();
  return (
    <div>
      <Tolerances
        tolerance={values.dereplicationOptions.shiftTolerances}
        onChangeTolerance={(tolerance: Tolerance) =>
          setFieldValue('dereplicationOptions.shiftTolerances', tolerance)
        }
      />
      <span>
        <label>Maximum avg. deviation [ppm]: </label>
        <Input
          type="number"
          onChange={(value) => {
            setFieldValue(
              'dereplicationOptions.maxAverageDeviation',
              Number(value),
            );
          }}
          defaultValue={values.dereplicationOptions.maxAverageDeviation}
          min={0}
          label="C"
        />
      </span>
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
