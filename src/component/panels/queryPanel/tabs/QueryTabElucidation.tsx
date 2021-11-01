import { useFormikContext } from 'formik';
import Button from '../../../elements/Button';
import { QueryOptions } from '../../../../types/QueryOptions';
import CheckBox from '../../../elements/CheckBox';
import Input from '../../../elements/Input';
import queryTypes from '../../../../constants/queryTypes';

function QueryTabElucidation() {
  const { values, setFieldValue, submitForm } =
    useFormikContext<QueryOptions>();

  return (
    <div className="query-options-tab-elucidation-container">
      <div>
        <p style={{ fontWeight: 'bold' }}>Connectivity Statistics Detection:</p>
        <div>
          <Input
            type="number"
            onChange={(value) => {
              setFieldValue(
                'detectionOptions.hybridizationDetectionThreshold',
                value / 100,
              );
            }}
            defaultValue={
              values.detectionOptions.hybridizationDetectionThreshold * 100
            }
            label="Minimal occurrence of hybridization in DB (%) "
            min={0}
            max={100}
            step={0.01}
          />
          <Input
            type="number"
            onChange={(value) => {
              setFieldValue(
                'detectionOptions.elementCountThreshold',
                value / 100,
              );
            }}
            defaultValue={values.detectionOptions.elementCountThreshold * 100}
            label="Minimal occurrence of element in neighborhood (%) "
            min={0}
            max={100}
            step={0.01}
          />
        </div>
        <Button
          child={'Detect'}
          onClick={() => {
            setFieldValue('queryType', queryTypes.detection);
            submitForm();
          }}
        />
      </div>
      <div className="elimination-container">
        <p style={{ fontWeight: 'bold' }}>
          Elimination of invalid correlations:{' '}
        </p>
        <CheckBox
          defaultValue={values.elucidationOptions.useElim}
          onChange={(isChecked) =>
            setFieldValue('elucidationOptions.useElim', isChecked)
          }
          label="allow"
        />
        <div className="elimination-inputs">
          <Input
            type="number"
            onChange={(value) => {
              setFieldValue('elucidationOptions.elimP1', Number(value));
            }}
            defaultValue={values.elucidationOptions.elimP1}
            label="number of eliminations"
            min={1}
          />
          <Input
            type="number"
            onChange={(value) => {
              setFieldValue('elucidationOptions.elimP2', Number(value));
            }}
            defaultValue={values.elucidationOptions.elimP2}
            label="maximal path length"
            min={2}
          />
        </div>
      </div>
      <p style={{ fontWeight: 'bold' }}>General allowed path lengths: </p>
      <div className="hmbc-container">
        <p>HMBC</p>
        <Input
          type="number"
          onChange={(value) => {
            setFieldValue('elucidationOptions.hmbcP3', Number(value));
          }}
          defaultValue={values.elucidationOptions.hmbcP3}
          label="min"
          min={2}
        />
        <Input
          type="number"
          onChange={(value) => {
            setFieldValue('elucidationOptions.hmbcP4', Number(value));
          }}
          defaultValue={values.elucidationOptions.hmbcP4}
          label="max"
          min={2}
        />
      </div>
      <div className="cosy-container">
        <p>COSY</p>
        <Input
          type="number"
          onChange={(value) => {
            setFieldValue('elucidationOptions.cosyP3', Number(value));
          }}
          defaultValue={values.elucidationOptions.cosyP3}
          label="min"
          min={3}
        />
        <Input
          type="number"
          onChange={(value) => {
            setFieldValue('elucidationOptions.cosyP4', Number(value));
          }}
          defaultValue={values.elucidationOptions.cosyP4}
          label="max"
          min={3}
        />
      </div>
      <p style={{ fontWeight: 'bold' }}>Structure Generation: </p>
      <div className="time-limit-container">
        <Input
          type="number"
          onChange={(value) => {
            setFieldValue('elucidationOptions.timeLimitTotal', Number(value));
          }}
          defaultValue={values.elucidationOptions.timeLimitTotal}
          min={1}
          label="Total time limit (min) "
        />
        <Input
          type="number"
          onChange={(value) => {
            setFieldValue(
              'elucidationOptions.maxAverageDeviation',
              Number(value),
            );
          }}
          defaultValue={values.elucidationOptions.maxAverageDeviation}
          min={0}
          label="max avg. deviation (ppm) "
        />
      </div>
      <p style={{ fontWeight: 'bold' }}>Further settings:</p>
      <div className="checkbox-container">
        <CheckBox
          defaultValue={values.elucidationOptions.allowHeteroHeteroBonds}
          onChange={(isChecked: boolean) =>
            setFieldValue(
              'elucidationOptions.allowHeteroHeteroBonds',
              isChecked,
            )
          }
          label="Allow Hetero-Hetero Bonds"
        />
        <CheckBox
          defaultValue={!values.elucidationOptions.useFilterLsdRing3}
          onChange={(isChecked: boolean) =>
            setFieldValue('elucidationOptions.useFilterLsdRing3', !isChecked)
          }
          label="Allow 3-membered rings"
        />
        <CheckBox
          defaultValue={!values.elucidationOptions.useFilterLsdRing4}
          onChange={(isChecked: boolean) =>
            setFieldValue('elucidationOptions.useFilterLsdRing4', !isChecked)
          }
          label="Allow 4-membered rings"
        />
      </div>
      <p style={{ fontWeight: 'bold' }}>Extras: </p>
      <div className="request-name-container">
        <Input
          type="string"
          onChange={(value: string) => {
            setFieldValue('retrievalOptions.resultName', value);
          }}
          defaultValue={values.retrievalOptions.resultName || ''}
          label="Task name"
        />
      </div>
    </div>
  );
}

export default QueryTabElucidation;
