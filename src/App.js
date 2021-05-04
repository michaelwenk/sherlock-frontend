import './App.scss';

import NMRium from 'nmrium';
import { useCallback, useState } from 'react';
import OCL, { Molecule } from 'openchemlib/full';
import { initOCL } from 'react-ocl-nmr';
import Spinner from './component/elements/Spinner';
import SplitPane from 'react-split-pane';
import QueryPanel from './component/panels/queryPanel/QueryPanel';
import ResultsPanel from './component/panels/resultsPanel/ResultsPanel';
import axios from 'axios';

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
  leftPanel: '25%',
  rightPanel: '25%',
  resizer: '15px',
};

function App() {
  const [data, setData] = useState();
  const [result, setResult] = useState({});
  const [leftPanelWidth, setLeftPanelWidth] = useState();
  const [hideLeftPanel, setHideLeftPanel] = useState(false);
  const [hideRightPanel, setHideRightPanel] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showQueryPanel, setShowQueryPanel] = useState(true);
  const [requestWasSuccessful, setRequestWasSuccessful] = useState();

  const handleOnDataChange = useCallback((nmriumData) => {
    // console.log(nmriumData);
    const _spectra =
      nmriumData && nmriumData.data
        ? nmriumData.data.reduce((acc, spectrum) => {
            if (spectrum.info.isFid === false) {
              const _spectrum = {
                id: spectrum.id,
                info: spectrum.info,
              };
              if (spectrum.info.dimension === 1) {
                _spectrum.ranges = spectrum.ranges;
                acc.push(_spectrum);
                // } else if (spectrum.info.dimension === 2) {
                //   _spectrum.zones = spectrum.zones;
                //   acc.push(_spectrum);
              }
            }
            return acc;
          }, [])
        : [];
    // console.log(_spectra);
    setData({ spectra: _spectra, correlations: nmriumData.correlations });
  }, []);

  const handleOnSubmit = useCallback(
    async (
      queryType,
      dereplicationOptions,
      elucidationOptions,
      retrievalOptions,
    ) => {
      setIsRequesting(true);
      setShowQueryPanel(false);

      const requestData = {
        data,
        queryType,
        dereplicationOptions,
        elucidationOptions,
        resultID: retrievalOptions.resultID,
      };
      console.log(requestData);

      const t0 = performance.now();
      let _result;
      await axios({
        method: 'POST',
        url: 'http://localhost:8081/webcase-core/core',
        // params: {},
        data: requestData,
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          setRequestWasSuccessful(true);
          _result = res;
        })
        .catch((e) => {
          setRequestWasSuccessful(false);
        })
        .finally(() => setIsRequesting(false));
      const t1 = performance.now();
      console.log('time need: ' + (t1 - t0) / 1000);
      console.log(_result);

      const molecules =
        _result && _result.data && _result.data.dataSetList
          ? _result.data.dataSetList.map((dataSet) => {
              const molecule = Molecule.fromSmiles(dataSet.meta.smiles);
              const {
                formula,
                relativeWeight,
              } = molecule.getMolecularFormula();
              return {
                molfile: molecule.toMolfileV3(),
                meta: { ...dataSet.meta, mf: formula, mw: relativeWeight },
              };
            })
          : [];

      setResult({
        molecules,
        resultID: _result ? _result.data.resultID : undefined,
        time: (t1 - t0) / 1000,
      });
    },
    [data],
  );

  const handleOnDragFinished = useCallback((width) => {
    setLeftPanelWidth(width);
  }, []);

  const handleOnDoubleClickResizer = useCallback(
    (e) => {
      e.stopPropagation();
      if (!hideLeftPanel && !hideRightPanel) {
        if (leftPanelWidth && leftPanelWidth < 0.5 * window.innerWidth) {
          setHideLeftPanel(true);
          setHideRightPanel(false);
        } else {
          setHideLeftPanel(false);
          setHideRightPanel(true);
        }
      } else {
        setHideLeftPanel(false);
        setHideRightPanel(false);
      }
    },
    [hideLeftPanel, hideRightPanel, leftPanelWidth],
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
          pane1Style={
            hideLeftPanel
              ? { display: 'none' }
              : hideRightPanel
              ? {
                  maxWidth: '100%',
                  width: `calc(100% - ${minWidth.resizer})`,
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
              : hideLeftPanel
              ? {
                  maxWidth: '100%',
                  width: `calc(100% - ${minWidth.resizer})`,
                }
              : {
                  height: '100%',
                  minWidth: minWidth.rightPanel,
                  maxWidth: `calc(100% - ${minWidth.leftPanel})`,
                }
          }
          onResizerDoubleClick={handleOnDoubleClickResizer}
          // onDragStarted={() => {
          //   console.log('onDragStarted');
          // }}
          onDragFinished={handleOnDragFinished}
        >
          <div className="nmrium-container">
            <NMRium
              preferences={preferences}
              onDataChange={handleOnDataChange}
              data={initData}
            />
          </div>
          <div className="panels">
            <button
              type="button"
              className="collapsible"
              style={{ '--sign': showQueryPanel ? '"\\2796"' : '"\\2795"' }}
              onClick={(e) => {
                e.stopPropagation();
                setShowQueryPanel(!showQueryPanel);
              }}
            >
              {showQueryPanel ? 'Hide query options' : 'Show query options'}
            </button>

            <QueryPanel
              onSubmit={handleOnSubmit}
              isRequesting={isRequesting}
              show={showQueryPanel}
            />
            {!showQueryPanel &&
              (isRequesting === true ? (
                <div className="spinner">
                  <Spinner />
                </div>
              ) : requestWasSuccessful === false ? (
                <div className="requestError">
                  <p>Request failed</p>
                </div>
              ) : (
                <ResultsPanel
                  result={result}
                  isRequesting={isRequesting}
                  onClickClear={() => setResult({})}
                />
              ))}
          </div>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;
