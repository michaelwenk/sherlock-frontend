import './App.css';
import QueryPanel from './component/panels/QueryPanel';
import NMRDisplayer from 'nmr-displayer';
import { useCallback, useState } from 'react';
import ResultsPanel from './component/panels/ResultsPanel';
import OCL from 'openchemlib/full';
import { initOCL } from 'react-ocl-nmr';
import SplitPane from 'react-split-pane';
import { Fragment } from 'react';

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

  const handleOnDataChange = useCallback((_data) => {
    setData(_data);
  }, []);

  const handleOnSetResults = useCallback((results) => {
    setResults(results);
  }, []);

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
            <QueryPanel data={data} onSetResults={handleOnSetResults} />
            <ResultsPanel results={results} />
          </Fragment>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;
