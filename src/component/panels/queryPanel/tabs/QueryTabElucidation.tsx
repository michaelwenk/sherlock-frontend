import './QueryTabElucidation.scss';

import { useFormikContext } from 'formik';
import Button from '../../../elements/Button';
import QueryOptions from '../../../../types/QueryOptions';
import queryTypes from '../../../../constants/queryTypes';
import FormikInput from '../../../elements/FormikInput';
import FormikCheckBox from '../../../elements/FormikCheckBox';
import { useEffect } from 'react';
import ErrorSymbol from '../../../elements/ErrorSymbol';

function QueryTabElucidation() {
  const { setFieldValue, submitForm, values, errors } =
    useFormikContext<QueryOptions>();

  useEffect(() => {
    if (values.detectionOptions.useNeighborDetections) {
      setFieldValue('detectionOptions.useHybridizationDetections', true);
    }
    if (!values.detectionOptions.useHybridizationDetections) {
      setFieldValue('detectionOptions.useNeighborDetections', false);
    }
  }, [
    setFieldValue,
    values.detectionOptions.useHybridizationDetections,
    values.detectionOptions.useNeighborDetections,
  ]);

  return (
    <div className="query-options-tab-elucidation-container">
      <table>
        <tbody>
          <tr>
            <td colSpan={2} style={{ fontWeight: 'bold' }}>
              Connectivity Statistics Detection:
            </td>
          </tr>
          <tr>
            <td>Use hybridization detection</td>
            <td style={{ textAlign: 'center' }}>
              <FormikCheckBox
                name="detectionOptions.useHybridizationDetections"
                {...{
                  disabled: values.detectionOptions.useNeighborDetections,
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Minimal occurrence of hybridization in DB (%)</td>
            <td>
              <FormikInput
                type="number"
                name="detectionOptions.hybridizationDetectionThreshold"
                inPercentage={true}
              />
            </td>
            <td>
              {errors.detectionOptions?.hybridizationDetectionThreshold && (
                <ErrorSymbol
                  message={
                    errors.detectionOptions.hybridizationDetectionThreshold
                  }
                />
              )}
            </td>
          </tr>
          <tr>
            <td>Use neighbor detection</td>
            <td style={{ textAlign: 'center' }}>
              <FormikCheckBox
                name="detectionOptions.useNeighborDetections"
                {...{
                  disabled: !values.detectionOptions.useHybridizationDetections,
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Lower limit for non-neighbors detection (%)</td>
            <td>
              <FormikInput
                type="number"
                name="detectionOptions.lowerElementCountThreshold"
                inPercentage={true}
              />
            </td>
            <td>
              {errors.detectionOptions?.lowerElementCountThreshold && (
                <ErrorSymbol
                  message={errors.detectionOptions.lowerElementCountThreshold}
                />
              )}
            </td>
          </tr>
          <tr>
            <td>Lower limit for set neighbors detection (%)</td>
            <td>
              <FormikInput
                type="number"
                name="detectionOptions.upperElementCountThreshold"
                inPercentage={true}
              />
            </td>
            <td>
              {errors.detectionOptions?.upperElementCountThreshold && (
                <ErrorSymbol
                  message={errors.detectionOptions.upperElementCountThreshold}
                />
              )}
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
              <FormikCheckBox name="elucidationOptions.useElim" />
            </td>
          </tr>
          <tr>
            <td>Number of eliminations</td>
            <td>
              <FormikInput type="number" name="elucidationOptions.elimP1" />
            </td>
            <td>
              {errors.elucidationOptions?.elimP1 && (
                <ErrorSymbol message={errors.elucidationOptions.elimP1} />
              )}
            </td>
          </tr>
          <tr>
            <td>Maximal path length</td>
            <td>
              <FormikInput type="number" name="elucidationOptions.elimP2" />
            </td>
            <td>
              {errors.elucidationOptions?.elimP2 && (
                <ErrorSymbol message={errors.elucidationOptions.elimP2} />
              )}
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
                name="elucidationOptions.timeLimitTotal"
              />
            </td>
            <td>
              {errors.elucidationOptions?.timeLimitTotal && (
                <ErrorSymbol
                  message={errors.elucidationOptions.timeLimitTotal}
                />
              )}
            </td>
          </tr>
          <tr>
            <td>Maximum average deviation (ppm)</td>
            <td>
              <FormikInput
                type="number"
                name="elucidationOptions.maxAverageDeviation"
              />
            </td>
            <td>
              {errors.elucidationOptions?.maxAverageDeviation && (
                <ErrorSymbol
                  message={errors.elucidationOptions.maxAverageDeviation}
                />
              )}
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
              <FormikCheckBox name="elucidationOptions.allowHeteroHeteroBonds" />
            </td>
          </tr>
          <tr>
            <td>Filter out 3-membered rings</td>
            <td>
              <FormikCheckBox name="elucidationOptions.useFilterLsdRing3" />
            </td>
          </tr>
          <tr>
            <td>Filter out 4-membered rings</td>
            <td>
              <FormikCheckBox name="elucidationOptions.useFilterLsdRing4" />
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
                name="retrievalOptions.resultName"
                inputWidth="100%"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default QueryTabElucidation;
