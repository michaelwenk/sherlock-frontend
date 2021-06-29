import './App.scss';

import NMRium from 'nmrium';
import React, { useCallback, useState } from 'react';
import { Molecule } from 'openchemlib/full';
import Spinner from './component/elements/Spinner';
import SplitPane from 'react-split-pane';
import QueryPanel from './component/panels/queryPanel/QueryPanel';
import ResultsPanel from './component/panels/resultsPanel/ResultsPanel';
import axios, { AxiosError, AxiosResponse, Canceler } from 'axios';
import { DataSet } from './types/webcase/DataSet';
import { Datum1D, Datum2D, Spectra, State } from './types/nmrium/nmrium';
import { Data } from './types/Data';
import { Result } from './types/Result';
import { ResultMolecule } from './types/ResultMolecule';
import { useRef } from 'react';

const preferences = {};

// const initData = {};

const minWidth = {
  leftPanel: '25%',
  rightPanel: '25%',
  resizer: '15px',
};

function App() {
  const [data, setData] = useState<Data>();
  const [result, setResult] = useState<Result>();
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>();
  const [hideLeftPanel, setHideLeftPanel] = useState<boolean>(false);
  const [hideRightPanel, setHideRightPanel] = useState<boolean>(false);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [showQueryPanel, setShowQueryPanel] = useState<boolean>(true);
  const [requestError, setRequestError] = useState<AxiosError>();
  const [requestWasCancelled, setRequestWasCancelled] =
    useState<boolean>(false);
  const cancelRequestRef = useRef<Canceler>();

  const handleOnDataChange = useCallback(function (nmriumData: State) {
    // console.log(nmriumData);
    const _spectra: Spectra =
      nmriumData && nmriumData.data
        ? nmriumData.data.reduce<Spectra>((acc, spectrum) => {
            if (spectrum.id && spectrum.info && spectrum.info.isFid === false) {
              if (spectrum.info.dimension === 1) {
                const _spectrum: Datum1D = {
                  id: spectrum.id,
                  info: spectrum.info,
                  ranges: (spectrum as Datum1D).ranges,
                  data: (spectrum as Datum1D).data,
                };
                acc.push(_spectrum);
              } else if (spectrum.info.dimension === 2) {
                const _spectrum: Datum2D = {
                  id: spectrum.id,
                  info: spectrum.info,
                  zones: (spectrum as Datum2D).zones,
                  data: (spectrum as Datum2D).data,
                };
                acc.push(_spectrum);
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

      let response: AxiosResponse | undefined;
      const t0 = performance.now();
      await axios({
        method: 'POST',
        url: 'http://localhost:8081/webcase-core/core',
        // params: {},
        data: requestData,
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken: new axios.CancelToken(
          (cancel) => (cancelRequestRef.current = cancel),
        ),
      })
        .then((res) => {
          setRequestError(undefined);
          setRequestWasCancelled(false);
          response = res;
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            setRequestWasCancelled(true);
          } else if (axios.isAxiosError(err)) {
            setRequestError(err);
          }
        })
        .finally(() => setIsRequesting(false));
      const t1 = performance.now();
      console.log('time need: ' + (t1 - t0) / 1000);
      console.log(response);

      const molecules: Array<ResultMolecule> =
        response && response.data && response.data.dataSetList
          ? (response.data.dataSetList as Array<DataSet>).map((dataSet) => {
              const molecule: Molecule = Molecule.fromSmiles(
                dataSet.meta.smiles,
              );
              const { formula } = molecule.getMolecularFormula();
              return {
                molfile: molecule.toMolfileV3(),
                meta: { ...dataSet.meta, mf: formula },
              };
            })
          : [];

      setResult({
        molecules,
        resultID: response ? response.data.resultID : undefined,
        time: (t1 - t0) / 1000,
      });
    },
    [data],
  );

  const handleOnCancelRequest = useCallback(() => {
    if (cancelRequestRef.current)
      cancelRequestRef.current('User has cancelled the request!!!');
  }, []);

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
              // data={initData}
            />
          </div>
          <div className="panels">
            <button
              type="button"
              className="collapsible"
              style={
                {
                  '--sign': showQueryPanel ? '"\\2796"' : '"\\2795"',
                } as React.CSSProperties
              }
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
                <Spinner onClickCancel={handleOnCancelRequest} />
              ) : requestError ? (
                <div className="requestError">
                  <p>
                    Request failed: Could not connect to WebCASE gateway
                    service.
                  </p>
                </div>
              ) : requestWasCancelled ? (
                <div className="requestCancelled">
                  <p>Request was cancelled by user!</p>
                </div>
              ) : (
                <ResultsPanel
                  result={result ?? { molecules: [] }}
                  onClickClear={() => setResult({ molecules: [] })}
                />
              ))}
          </div>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;
