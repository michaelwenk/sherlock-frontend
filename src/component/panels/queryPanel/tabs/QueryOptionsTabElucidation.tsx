import './QueryOptionsTabElucidation.scss';
import CheckBox from '../../../elements/CheckBox';
import { useFormikContext } from 'formik';
import Input from '../../../elements/Input';
import { QueryOptions } from '../../../../types/QueryOptions';

function QueryTabElucidation() {
  const { values, setFieldValue } = useFormikContext<QueryOptions>();

  return (
    <div className="query-options-tab-elucidation-container">
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
            setFieldValue('elucidationOptions.maxRMSD', Number(value));
          }}
          defaultValue={values.elucidationOptions.maxRMSD}
          min={0}
          label="max RMSD (ppm) "
        />
      </div>
      <p style={{ fontWeight: 'bold' }}>Further settings:</p>
      <div className="checkbox-container">
        <CheckBox
          defaultValue={values.elucidationOptions.allowHeteroHeteroBonds}
          onChange={(isChecked) =>
            setFieldValue(
              'elucidationOptions.allowHeteroHeteroBonds',
              isChecked,
            )
          }
          label="Allow Hetero-Hetero Bonds"
        />
        <CheckBox
          defaultValue={values.elucidationOptions.useFilterLsdRing3}
          onChange={(isChecked) =>
            setFieldValue('elucidationOptions.useFilterLsdRing3', isChecked)
          }
          label="Use filter for 3-membered rings"
        />
        <CheckBox
          defaultValue={values.elucidationOptions.useFilterLsdRing4}
          onChange={(isChecked) =>
            setFieldValue('elucidationOptions.useFilterLsdRing4', isChecked)
          }
          label="Use filter for 4-membered rings"
        />
      </div>
      <div>
        <p style={{ fontWeight: 'bold' }}>Automatic hybridization detection:</p>
        <Input
          type="number"
          onChange={(value) => {
            setFieldValue(
              'elucidationOptions.hybridizationDetectionThreshold',
              value / 100,
            );
          }}
          defaultValue={
            values.elucidationOptions.hybridizationDetectionThreshold * 100
          }
          label="Allowed minimal occurrence per hybridization (%) "
          min={0}
          max={100}
          step={1}
        />
      </div>
    </div>
  );
}

export default QueryTabElucidation;
