import './QueryOptionsTabElucidation.scss';
import CheckBox from '../../../elements/CheckBox';
import { useFormikContext } from 'formik';
import Input from '../../../elements/Input';

function QueryTabElucidation() {
  const { values, setFieldValue } = useFormikContext();

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
          title="allow"
        />
        <div className="elimination-inputs">
          <Input
            type="number"
            onChange={(value) => {
              setFieldValue('elucidationOptions.elimP1', Number(value));
            }}
            defaultValue={values.elucidationOptions.elimP1}
            label="number of eliminations"
          />
          <Input
            type="number"
            onChange={(value) => {
              setFieldValue('elucidationOptions.elimP2', Number(value));
            }}
            defaultValue={values.elucidationOptions.elimP2}
            label="maximal path length"
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
        />
        <Input
          type="number"
          onChange={(value) => {
            setFieldValue('elucidationOptions.hmbcP4', Number(value));
          }}
          defaultValue={values.elucidationOptions.hmbcP4}
          label="max"
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
        />
        <Input
          type="number"
          onChange={(value) => {
            setFieldValue('elucidationOptions.cosyP4', Number(value));
          }}
          defaultValue={values.elucidationOptions.cosyP4}
          label="max"
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
          title="Allow Hetero-Hetero Bonds"
        />
        <CheckBox
          defaultValue={values.elucidationOptions.useFilterLsdRing3}
          onChange={(isChecked) =>
            setFieldValue('elucidationOptions.useFilterLsdRing3', isChecked)
          }
          title="Use filter for 3-membered rings"
        />
        <CheckBox
          defaultValue={values.elucidationOptions.useFilterLsdRing4}
          onChange={(isChecked) =>
            setFieldValue('elucidationOptions.useFilterLsdRing4', isChecked)
          }
          title="Use filter for 4-membered rings"
        />
      </div>
      <div>
        <p style={{ fontWeight: 'bold' }}>Automatic hybridization detection:</p>
        <Input
          type="number"
          onChange={(value) => {
            setFieldValue(
              'elucidationOptions.hybridizationDetectionThreshold',
              Number(value),
            );
          }}
          defaultValue={
            values.elucidationOptions.hybridizationDetectionThreshold
          }
          label="Allowed minimal occurrence"
        />
      </div>
    </div>
  );
}

export default QueryTabElucidation;
