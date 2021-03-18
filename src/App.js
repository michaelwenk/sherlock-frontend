import './App.css';
import NMRDisplayer from 'nmr-displayer';
import { useCallback, useState } from 'react';
import OCL from 'openchemlib/full';
import { initOCL } from 'react-ocl-nmr';
import SplitPane from 'react-split-pane';
import { Fragment } from 'react';
import QueryPanel from './component/panels/queryPanel/QueryPanel';
import ResultsPanel from './component/panels/resultsPanel/ResultsPanel';
import axios from 'axios';
import lodashCloneDeep from 'lodash/cloneDeep';

initOCL(OCL);

const preferences = {};

const initData = {
  correlations: {
    options: {
      tolerance: {
        C: 0.25,
        H: 0.02,
        N: 0.25,
      },
    },
  },
};

const minWidth = {
  leftPanel: '10%',
  rightPanel: '20%',
  resizer: '15px',
};

function App() {
  const [data, setData] = useState();
  const [results, setResults] = useState();
  const [hideRightPanel, setHideRightPanel] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleOnDataChange = useCallback((_data) => {
    setData(_data);
  }, []);

  const handleOnSubmit = useCallback(
    async (queryType, tolerance, allowHeteroHeteroBonds, retrievalID) => {
      setIsRequesting(true);

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
      console.log(_data);

      const t0 = performance.now();
      const results = await axios({
        method: 'POST',
        url: 'http://localhost:8081/webcase-core/core',
        params: {
          queryType,
          allowHeteroHeteroBonds,
          retrievalID,
        },
        data: { data: _data, queryType, allowHeteroHeteroBonds, retrievalID },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setIsRequesting(false);
      const t1 = performance.now();
      console.log(results.data);
      setResults({ data: results.data, time: (t1 - t0) / 1000 });
    },
    [data],
  );

  return (
    <div className="app">
      <div className="app-header">
        <p>Welcome to WebCASE !!!</p>
      </div>
      <div className="app-body">
        <SplitPane
          split="vertical"
          defaultSize="80%"
          minSize="50%"
          pane1Style={
            hideRightPanel
              ? {
                  maxWidth: '100%',
                  width: 'calc(100% - 15px)',
                }
              : {
                  height: '100%',
                  maxWidth: `calc(100% - ${minWidth.rightPanel} - ${minWidth.resizer})`,
                  minWidth: minWidth.leftPanel,
                }
          }
          pane2Style={
            hideRightPanel
              ? { display: 'none' }
              : {
                  height: '100%',
                  minWidth: minWidth.rightPanel,
                  maxWidth: `calc(100% - ${minWidth.leftPanel})`,
                }
          }
          onResizerDoubleClick={(e) => {
            console.log('onDoubleClick');
            e.stopPropagation();
            setHideRightPanel(!hideRightPanel);
          }}
          // onDragStarted={() => {
          //   console.log('onDragStarted');
          // }}
          // onDragFinished={(width) => {
          //   console.log('onDragFinished');
          // }}
        >
          <NMRDisplayer
            preferences={preferences}
            onDataChange={handleOnDataChange}
            data={initData}
          />
          <Fragment>
            <QueryPanel
              data={data}
              onSubmit={handleOnSubmit}
              isRequesting={isRequesting}
            />
            <ResultsPanel results={results} isRequesting={isRequesting} />
          </Fragment>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;
