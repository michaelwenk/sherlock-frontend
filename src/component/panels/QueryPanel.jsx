/** @jsxImportSource @emotion/react */
import axios from 'axios';
import { useCallback, useState } from 'react';
import CheckBox from '../elements/CheckBox';
import lodashCloneDeep from 'lodash/cloneDeep';
import './QueryPanel.css';
import Tolerances from '../elements/Tolerances';

const defaultTolerance = {
  C: 1.0,
  H: 0.1,
  N: 2.0,
};

function QueryPanel({ data, onSetResults }) {
  const [dereplicate, setDereplicate] = useState(true);
  const [useMF, setUseMF] = useState(true);
  const [allowHeteroHeteroBonds, setAllowHeteroHeteroBonds] = useState(false);
  const [tolerance, setTolerance] = useState(defaultTolerance);

  const handleOnClick = useCallback(
    async (e) => {
      e.stopPropagation();

      // data manipulation only for now until the new nmr-displayer version is released
      const _data = lodashCloneDeep(data);
      _data.correlations.values = _data.correlations.values.map(
        (correlation) => ({
          ...correlation,
          equivalence:
            correlation.atomType !== 'H'
              ? correlation.equivalence + 1
              : correlation.attachment &&
                Object.keys(correlation.attachment).length > 0
              ? (_data.correlations.values[
                  correlation.attachment[
                    Object.keys(correlation.attachment)[0]
                  ][0]
                ].equivalence +
                  1) *
                _data.correlations.values[
                  correlation.attachment[
                    Object.keys(correlation.attachment)[0]
                  ][0]
                ].protonsCount[0]
              : correlation.equivalence + 1,
        }),
      );
      _data.correlations.options.tolerance = tolerance;
      if (useMF === false) {
        delete _data.correlations.options.mf;
      }
      console.log(_data);

      const results = await axios({
        method: 'POST',
        url: 'http://localhost:8081/webcase-core/core',
        params: {
          dereplicate,
          allowHeteroHeteroBonds,
        },
        data: _data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(results.data);
      onSetResults(results.data);
    },
    [allowHeteroHeteroBonds, data, dereplicate, onSetResults, tolerance, useMF],
  );

  const onChangeDereplicate = useCallback((e) => {
    e.stopPropagation();
    setDereplicate(e.target.checked);
  }, []);

  const onChangeUseMF = useCallback((e) => {
    e.stopPropagation();
    setUseMF(e.target.checked);
  }, []);

  const onChangeAllowHeteroHeteroBonds = useCallback((e) => {
    e.stopPropagation();
    setAllowHeteroHeteroBonds(e.target.checked);
  }, []);

  const onChangeToleranceHandler = useCallback((_tolerance) => {
    setTolerance(_tolerance);
  }, []);

  return (
    <div className="query-panel">
      <p>QueryPanel!!!</p>
      <CheckBox
        isChecked={dereplicate}
        handleOnChange={onChangeDereplicate}
        title="Dereplication"
      />
      <CheckBox
        isChecked={useMF}
        handleOnChange={onChangeUseMF}
        title="use MF"
      />
      <CheckBox
        isChecked={allowHeteroHeteroBonds}
        handleOnChange={onChangeAllowHeteroHeteroBonds}
        title="Allow Hetero-Hetero Bonds"
      />
      {dereplicate && (
        <Tolerances
          tolerance={tolerance}
          onChangeTolerance={onChangeToleranceHandler}
        />
      )}
      <button type="button" onClick={handleOnClick}>
        Submit
      </button>
    </div>
  );
}

export default QueryPanel;
