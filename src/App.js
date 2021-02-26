import './App.css';
import QueryPanel from './component/panels/QueryPanel';
import NMRDisplayer from 'nmr-displayer';
import { useCallback, useState } from 'react';

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

  const handleOnDataChange = useCallback((data) => {
    console.log(data);
    setData(data);
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
        <QueryPanel data={data} />
      </div>
    </div>
  );
}

export default App;
