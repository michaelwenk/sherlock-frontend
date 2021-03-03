import './App.css';
import QueryPanel from './component/panels/QueryPanel';
import NMRDisplayer from 'nmr-displayer';
import { useCallback, useState } from 'react';
import ResultsPanel from './component/panels/ResultsPanel';
import OCL from 'openchemlib/full';
import { initOCL } from 'react-ocl-nmr';

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

function App() {
  const [data, setData] = useState();
  const [results, setResults] = useState();

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
        <div className="nmr-displayer">
          <NMRDisplayer
            preferences={preferences}
            onDataChange={handleOnDataChange}
            data={initData}
          />
        </div>
        <div className="panels">
          <QueryPanel data={data} onSetResults={handleOnSetResults} />
          <ResultsPanel results={results} />
        </div>
      </div>
    </div>
  );
}

export default App;
