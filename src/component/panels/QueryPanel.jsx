/** @jsxImportSource @emotion/react */
import axios from 'axios';
import { useCallback, useState } from 'react';
import CheckBox from '../elements/CheckBox';
import lodashCloneDeep from 'lodash/cloneDeep';
import './QueryPanel.css';

function QueryPanel({ data, onSetResults }) {
  const [dereplicate, setDereplicate] = useState(true);
  const [allowHeteroHeteroBonds, setAllowHeteroHeteroBonds] = useState(false);

  const handleOnClick = useCallback(
    async (e) => {
      e.stopPropagation();

      const _data = lodashCloneDeep(data);
      _data.correlations.values = _data.correlations.values.map(
        (correlation) => ({
          ...correlation,
          equivalence: correlation.equivalence + 1,
        }),
      );
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
      console.log(JSON.stringify(results.data));
      onSetResults(results.data);
    },
    [allowHeteroHeteroBonds, data, dereplicate, onSetResults],
  );

  const onChangeDereplicate = useCallback((e) => {
    e.stopPropagation();
    setDereplicate(e.target.checked);
  }, []);

  const onChangeAllowHeteroHeteroBonds = useCallback((e) => {
    e.stopPropagation();
    setAllowHeteroHeteroBonds(e.target.checked);
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
        isChecked={allowHeteroHeteroBonds}
        handleOnChange={onChangeAllowHeteroHeteroBonds}
        title="Allow Hetero-Hetero Bonds"
      />
      <button type="button" onClick={handleOnClick}>
        Submit
      </button>
    </div>
  );
}

export default QueryPanel;
