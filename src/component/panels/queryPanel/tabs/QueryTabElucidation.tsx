import './QueryTabElucidation.scss';

import { useFormikContext } from 'formik';
import Button from '../../../elements/Button';
import QueryOptions from '../../../../types/QueryOptions';
import queryTypes from '../../../../constants/queryTypes';
import FormikInput from '../../../elements/FormikInput';
import FormikCheckBox from '../../../elements/FormikCheckBox';
import { memo, useEffect, useMemo, useState } from 'react';
import ErrorSymbol from '../../../elements/ErrorSymbol';
import capitalize from '../../../../utils/capitalize';
import ConfirmModal from '../../../elements/modal/ConfirmModal';
import { useData } from '../../../../context/DataContext';
import { getAtomCounts } from 'nmr-correlation';

function QueryTabElucidation() {
  const { isRequesting, nmriumData, resultData } = useData();
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);

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

  const allowUseCombinatorics = useMemo((): boolean => {
    const grouping = resultData?.resultRecord?.grouping;
    return (
      grouping !== undefined &&
      grouping !== null &&
      grouping.groups !== undefined &&
      Object.entries(grouping.groups).some((entryPerAtomType) =>
        Object.entries(entryPerAtomType[1]).some(
          (entryPerGroup) => entryPerGroup[1].length > 1,
        ),
      )
    );
  }, [resultData?.resultRecord?.grouping]);

  const allowUseHeteroHeteroBonds = useMemo((): boolean => {
    let sumHeteroAtoms = 0;
    Object.entries(
      getAtomCounts(nmriumData?.correlations?.options?.mf || ''),
    ).forEach(([atomType, count]) => {
      if (atomType !== 'C' && atomType !== 'H') {
        sumHeteroAtoms += count;
      }
    });

    return sumHeteroAtoms >= 2;
  }, [nmriumData?.correlations.options.mf]);

  return useMemo(
    () => (
      <div className="query-options-tab-elucidation-container">
        <div className="options-tab-elucidation-table-container">
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
                    {...{
                      disabled:
                        !values.detectionOptions.useHybridizationDetections,
                    }}
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
                      disabled:
                        !values.detectionOptions.useHybridizationDetections,
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
                    {...{
                      disabled: !values.detectionOptions.useNeighborDetections,
                    }}
                  />
                </td>
                <td>
                  {errors.detectionOptions?.lowerElementCountThreshold && (
                    <ErrorSymbol
                      message={
                        errors.detectionOptions.lowerElementCountThreshold
                      }
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
                    {...{
                      disabled: !values.detectionOptions.useNeighborDetections,
                    }}
                  />
                </td>
                <td>
                  {errors.detectionOptions?.upperElementCountThreshold && (
                    <ErrorSymbol
                      message={
                        errors.detectionOptions.upperElementCountThreshold
                      }
                    />
                  )}
                </td>
              </tr>

              <tr>
                <td colSpan={2} style={{ fontWeight: 'bold' }}>
                  Fragment Detection:
                </td>
              </tr>
              <tr>
                <td>Search for fragments (might take a moment)</td>
                <td style={{ textAlign: 'center' }}>
                  <FormikCheckBox name="detectionOptions.detectFragments" />
                </td>
              </tr>
              <tr>
                <td>Shift tolerance (ppm)</td>
                <td>
                  <FormikInput
                    type="number"
                    name="detectionOptions.shiftToleranceFragmentDetection"
                    {...{
                      disabled: !values.detectionOptions.detectFragments,
                    }}
                  />
                </td>
                <td>
                  {errors.detectionOptions?.shiftToleranceFragmentDetection && (
                    <ErrorSymbol
                      message={
                        errors.detectionOptions.shiftToleranceFragmentDetection
                      }
                    />
                  )}
                </td>
              </tr>
              <tr>
                <td>Maximum average deviation (ppm)</td>
                <td>
                  <FormikInput
                    type="number"
                    name="detectionOptions.maximumAverageDeviationFragmentDetection"
                    {...{
                      disabled: !values.detectionOptions.detectFragments,
                    }}
                  />
                </td>
                <td>
                  {errors.detectionOptions
                    ?.maximumAverageDeviationFragmentDetection && (
                    <ErrorSymbol
                      message={
                        errors.detectionOptions
                          .maximumAverageDeviationFragmentDetection
                      }
                    />
                  )}
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <div className="button-container">
                    <Button
                      child={'Detect'}
                      onClick={() => {
                        setFieldValue('queryType', queryTypes.detection);
                        submitForm();
                      }}
                      disabled={isRequesting}
                      style={{
                        color: isRequesting ? 'grey' : 'inherit',
                      }}
                    />
                  </div>
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
                  <FormikInput
                    type="number"
                    name="elucidationOptions.elimP1"
                    {...{
                      disabled: !values.elucidationOptions.useElim,
                    }}
                  />
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
                  <FormikInput
                    type="number"
                    name="elucidationOptions.elimP2"
                    {...{
                      disabled: !values.elucidationOptions.useElim,
                    }}
                  />
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
                <td>Allow combinatorics</td>
                <td>
                  <FormikCheckBox
                    name="elucidationOptions.useCombinatorics"
                    {...{
                      disabled: !allowUseCombinatorics,
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Allow hetero-hetero bonds</td>
                <td>
                  <FormikCheckBox
                    name="elucidationOptions.allowHeteroHeteroBonds"
                    {...{
                      disabled: !allowUseHeteroHeteroBonds,
                    }}
                  />
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
                  Spectra prediction:
                </td>
              </tr>
              <tr>
                <td>Shift tolerance (ppm)</td>
                <td>
                  <FormikInput
                    type="number"
                    name="predictionOptions.shiftTolerance"
                  />
                </td>
                <td>
                  {errors.predictionOptions?.shiftTolerance && (
                    <ErrorSymbol
                      message={errors.predictionOptions.shiftTolerance}
                    />
                  )}
                </td>
              </tr>
              <tr>
                <td>Maximum average deviation (ppm)</td>
                <td>
                  <FormikInput
                    type="number"
                    name="predictionOptions.maximumAverageDeviation"
                  />
                </td>
                <td>
                  {errors.predictionOptions?.maximumAverageDeviation && (
                    <ErrorSymbol
                      message={errors.predictionOptions.maximumAverageDeviation}
                    />
                  )}
                </td>
              </tr>
              <tr>
                <td>Allow stereo prediction and re-ranking</td>
                <td>
                  <FormikCheckBox name="predictionOptions.predictWithStereo" />
                </td>
              </tr>

              <tr>
                <td>Number of top-ranked candidates:</td>
                <td>
                  <FormikInput
                    type="number"
                    name="predictionOptions.stereoPredictionLimit"
                    {...{
                      disabled: !values.predictionOptions.predictWithStereo,
                    }}
                  />
                </td>
                <td>
                  {errors.predictionOptions?.stereoPredictionLimit && (
                    <ErrorSymbol
                      message={errors.predictionOptions.stereoPredictionLimit}
                    />
                  )}
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
          <div className="button-container">
            <Button
              onClick={() => {
                if (!values.detectionOptions.useHybridizationDetections) {
                  setShowConfirmDialog(true);
                } else {
                  setFieldValue('queryType', queryTypes.elucidation);
                  submitForm();
                }
              }}
              child={capitalize(queryTypes.elucidation)}
              disabled={isRequesting || Object.keys(errors).length > 0}
              style={{
                color:
                  isRequesting || Object.keys(errors).length > 0
                    ? 'grey'
                    : 'inherit',
              }}
            />
          </div>
          <ConfirmModal
            show={showConfirmDialog}
            header="Start elucidation without set or detected hybridizations?"
            onCancel={() => setShowConfirmDialog(false)}
            onConfirm={() => {
              setShowConfirmDialog(false);
              setFieldValue('queryType', queryTypes.elucidation);
              submitForm();
            }}
            body={
              <p
                style={{
                  fontSize: '15px',
                  color: 'blue',
                }}
              >
                This could lead to a long running time!
              </p>
            }
          />
        </div>
      </div>
    ),
    [
      allowUseCombinatorics,
      allowUseHeteroHeteroBonds,
      errors,
      isRequesting,
      setFieldValue,
      showConfirmDialog,
      submitForm,
      values.detectionOptions.detectFragments,
      values.detectionOptions.useHybridizationDetections,
      values.detectionOptions.useNeighborDetections,
      values.elucidationOptions.useElim,
      values.predictionOptions.predictWithStereo,
    ],
  );
}

export default memo(QueryTabElucidation);
