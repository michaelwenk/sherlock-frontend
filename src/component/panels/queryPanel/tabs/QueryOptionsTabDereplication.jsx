/** @jsxImportSource @emotion/react */

import Tolerances from '../../../elements/Tolerances';
import { useFormikContext } from 'formik';
import CheckBox from '../../../elements/CheckBox';

function QueryTabDereplication() {
  const { values, setFieldValue } = useFormikContext();
  return (
    <div>
      <Tolerances
        tolerance={values.dereplicationOptions.shiftTolerances}
        onChangeTolerance={(tolerance) =>
          setFieldValue('dereplicationOptions.shiftTolerances', tolerance)
        }
      />
      <CheckBox
        defaultValue={values.dereplicationOptions.checkMultiplicity}
        onChange={(isChecked) =>
          setFieldValue('dereplicationOptions.checkMultiplicity', isChecked)
        }
        title="Check Multiplicity"
      />
      <CheckBox
        defaultValue={values.dereplicationOptions.checkEquivalencesCount}
        onChange={(isChecked) =>
          setFieldValue(
            'dereplicationOptions.checkEquivalencesCount',
            isChecked,
          )
        }
        title="Check Equivalences Count"
      />
      <CheckBox
        defaultValue={values.dereplicationOptions.useMF}
        onChange={(isChecked) =>
          setFieldValue('dereplicationOptions.useMF', isChecked)
        }
        title="use MF"
      />
    </div>
  );
}

export default QueryTabDereplication;
