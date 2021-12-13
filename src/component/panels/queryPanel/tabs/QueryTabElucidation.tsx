import { useFormikContext } from 'formik';
import Button from '../../../elements/Button';
import { QueryOptions } from '../../../../types/QueryOptions';
import queryTypes from '../../../../constants/queryTypes';
import FormikInput from '../../../elements/FormikInput';
import FormikCheckBox from '../../../elements/FormikCheckBox';

function QueryTabElucidation() {
  const { setFieldValue, submitForm } = useFormikContext<QueryOptions>();

  return (
    <div className="query-options-tab-elucidation-container">
      <div>
        <table style={{ textAlign: 'left', marginTop: '5px' }}>
          <tbody>
            <tr>
              <td colSpan={2} style={{ fontWeight: 'bold' }}>
                Connectivity Statistics Detection:
              </td>
            </tr>
            <tr>
              <td>Minimal occurrence of hybridization in DB (%)</td>
              <td>
                <FormikInput
                  type="number"
                  // label="Minimal occurrence of hybridization in DB (%)"
                  name="detectionOptions.hybridizationDetectionThreshold"
                  inPercentage={true}
                  min={0}
                  max={100}
                />
              </td>
            </tr>
            <tr>
              <td>Lower limit for non-neighbors detection (%)</td>
              <td>
                <FormikInput
                  type="number"
                  // label="Lower limit for non-neighbors detection (%)"
                  name="detectionOptions.lowerElementCountThreshold"
                  inPercentage={true}
                  min={0}
                  max={100}
                />
              </td>
            </tr>
            <tr>
              <td>Lower limit for set neighbors detection (%)</td>
              <td>
                <FormikInput
                  type="number"
                  // label="Lower limit for set neighbors detection (%)"
                  name="detectionOptions.upperElementCountThreshold"
                  inPercentage={true}
                  min={0}
                  max={100}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ textAlign: 'center' }}>
                <Button
                  child={'Detect'}
                  onClick={() => {
                    setFieldValue('queryType', queryTypes.detection);
                    submitForm();
                  }}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ fontWeight: 'bold' }}>
                {' '}
                Elimination of correlations:
              </td>
            </tr>
            <tr>
              <td>Allow</td>
              <td style={{ textAlign: 'center' }}>
                <FormikCheckBox
                  name="elucidationOptions.useElim"
                  // label="allow"
                />
              </td>
            </tr>
            <tr>
              <td>Number of eliminations</td>
              <td>
                <FormikInput
                  type="number"
                  // label="Number of eliminations"
                  name="elucidationOptions.elimP1"
                  min={1}
                  max={20}
                />
              </td>
            </tr>
            <tr>
              <td>Maximal path length</td>
              <td>
                <FormikInput
                  type="number"
                  // label="Maximal path length"
                  name="elucidationOptions.elimP2"
                  min={4}
                  max={10}
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ fontWeight: 'bold' }}>
                Structure Generation:
              </td>
            </tr>
            <tr>
              <td>Total time limit (min)</td>
              <td>
                <FormikInput
                  type="number"
                  // label="Total time limit (min)"
                  name="elucidationOptions.timeLimitTotal"
                />
              </td>
            </tr>
            <tr>
              <td>Maximum average deviation (ppm)</td>
              <td>
                <FormikInput
                  type="number"
                  // label="Max avg. deviation (ppm)"
                  name="elucidationOptions.maxAverageDeviation"
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ fontWeight: 'bold' }}>
                Further settings:
              </td>
            </tr>
            <tr>
              <td>Allow Hetero-Hetero Bonds</td>
              <td>
                <FormikCheckBox
                  name="elucidationOptions.allowHeteroHeteroBonds"
                  // label="Allow Hetero-Hetero Bonds"
                />
              </td>
            </tr>
            <tr>
              <td>Filter out 3-membered rings</td>
              <td>
                <FormikCheckBox
                  name="elucidationOptions.useFilterLsdRing3"
                  // label="Filter out 3-membered rings"
                />
              </td>
            </tr>
            <tr>
              <td>Filter out 4-membered rings</td>
              <td>
                <FormikCheckBox
                  name="elucidationOptions.useFilterLsdRing4"
                  // label="Filter out 4-membered rings"
                />
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ fontWeight: 'bold' }}>
                Task name:
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <FormikInput
                  type="string"
                  // label="Task name"
                  name="retrievalOptions.resultName"
                  inputWidth="100%"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QueryTabElucidation;
