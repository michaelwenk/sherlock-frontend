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
        <p style={{ fontWeight: 'bold' }}>Connectivity Statistics Detection:</p>
        <div>
          <FormikInput
            type="number"
            label="Minimal occurrence of hybridization in DB (%)"
            name="detectionOptions.hybridizationDetectionThreshold"
            inPercentage={true}
            min={0}
            max={100}
          />
          <FormikInput
            type="number"
            label="Lower limit for non-neighbors detection (%)"
            name="detectionOptions.lowerElementCountThreshold"
            inPercentage={true}
            min={0}
            max={100}
          />
          <FormikInput
            type="number"
            label="Lower limit for set neighbors detection (%)"
            name="detectionOptions.upperElementCountThreshold"
            inPercentage={true}
            min={0}
            max={100}
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
        <FormikCheckBox name="elucidationOptions.useElim" label="allow" />
        <div className="elimination-inputs">
          <FormikInput
            type="number"
            label="Number of eliminations"
            name="elucidationOptions.elimP1"
            min={1}
            max={20}
          />
          <FormikInput
            type="number"
            label="Maximal path length"
            name="elucidationOptions.elimP2"
            min={4}
            max={10}
          />
        </div>
      </div>
      <p style={{ fontWeight: 'bold' }}>Structure Generation: </p>
      <div className="time-limit-container">
        <FormikInput
          type="number"
          label="Total time limit (min)"
          name="elucidationOptions.timeLimitTotal"
        />
        <FormikInput
          type="number"
          label="Max avg. deviation (ppm)"
          name="elucidationOptions.maxAverageDeviation"
        />
      </div>
      <p style={{ fontWeight: 'bold' }}>Further settings:</p>
      <div className="checkbox-container">
        <FormikCheckBox
          name="elucidationOptions.allowHeteroHeteroBonds"
          label="Allow Hetero-Hetero Bonds"
        />
        <FormikCheckBox
          name="elucidationOptions.useFilterLsdRing3"
          label="Filter out 3-membered rings"
        />
        <FormikCheckBox
          name="elucidationOptions.useFilterLsdRing4"
          label="Filter out 4-membered rings"
        />
      </div>
      <p style={{ fontWeight: 'bold' }}>Extras: </p>
      <div className="request-name-container">
        <FormikInput
          type="string"
          label="Task name"
          name="retrievalOptions.resultName"
          inputWidth="100%"
        />
      </div>
    </div>
  );
}

export default QueryTabElucidation;
