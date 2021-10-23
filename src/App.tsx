import './App.scss';

import NMRium, { Spectra } from 'nmrium';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Molecule } from 'openchemlib/full';
import Spinner from './component/elements/Spinner';
import SplitPane from 'react-split-pane';
import QueryPanel from './component/panels/queryPanel/QueryPanel';
import ResultsPanel from './component/panels/resultsPanel/ResultsPanel';
import axios, { AxiosError, AxiosResponse, Canceler } from 'axios';
import { DataSet } from './types/webcase/DataSet';
import { Result } from './types/Result';
import { ResultMolecule } from './types/ResultMolecule';
import { Datum1D } from 'nmrium/lib/data/data1d/Spectrum1D';
import { Datum2D } from 'nmrium/lib/data/data2d/Spectrum2D';
import { State } from 'nmrium/lib/component/reducer/Reducer';
import { Types } from 'nmr-correlation';
import queryTypes from './constants/queryTypes';

const preferences = {};
// const initData = {};

const minWidth = {
  leftPanel: '25%',
  rightPanel: '25%',
  resizer: '15px',
};

function App() {
  const [nmriumData, setNmriumData] = useState<State>();
  const [result, setResult] = useState<Result>();
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>();
  const [hideLeftPanel, setHideLeftPanel] = useState<boolean>(false);
  const [hideRightPanel, setHideRightPanel] = useState<boolean>(false);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [showQueryPanel, setShowQueryPanel] = useState<boolean>(true);
  const [requestError, setRequestError] = useState<AxiosError>();
  const [requestWasCancelled, setRequestWasCancelled] =
    useState<boolean>(false);
  const [isCanceling, setIsCanceling] = useState<boolean>(false);
  const cancelRequestRef = useRef<Canceler>();

  const handleOnNMRiumDataChange = useCallback(function (nmriumData: State) {
    // console.log(nmriumData);
    setNmriumData(nmriumData);
  }, []);

  const processNMRiumData = (nmriumData: State) => {
    const _spectra =
      nmriumData && nmriumData.data
        ? nmriumData.data.reduce<Spectra>((acc, spectrum) => {
            if (
              spectrum &&
              spectrum.id &&
              spectrum.info &&
              spectrum.info.isFid === false
            ) {
              if (spectrum.info.dimension === 1) {
                const _spectrum = {
                  id: spectrum.id,
                  info: spectrum.info,
                  ranges: (spectrum as Datum1D).ranges,
                  data: (spectrum as Datum1D).data,
                };
                acc.push(_spectrum as Datum1D);
              } else if (spectrum.info.dimension === 2) {
                const _spectrum = {
                  id: spectrum.id,
                  info: spectrum.info,
                  zones: (spectrum as Datum2D).zones,
                  data: (spectrum as Datum2D).data,
                };
                acc.push(_spectrum as Datum2D);
              }
            }
            return acc;
          }, [])
        : [];
    // console.log(_spectra);
    return _spectra;
  };

  const handleOnSubmit = useCallback(
    async (
      queryType,
      dereplicationOptions,
      elucidationOptions,
      detectionOptions,
      retrievalOptions,
    ) => {
      setIsRequesting(true);
      setShowQueryPanel(false);

      const data =
        queryType === queryTypes.dereplication ||
        queryType === queryTypes.elucidation ||
        queryType === queryTypes.detection
          ? {
              spectra: nmriumData ? processNMRiumData(nmriumData) : [],
              correlations: nmriumData
                ? {
                    ...nmriumData.correlations,
                    values: nmriumData.correlations.values.map(
                      (value: Types.Correlation) => {
                        return {
                          ...value,
                          hybridization:
                            value.hybridization.trim().length === 0
                              ? []
                              : [value.hybridization],
                        };
                      },
                    ),
                  }
                : {},
            }
          : {};

      const requestData = {
        data,
        queryType,
        dereplicationOptions,
        elucidationOptions,
        detectionOptions,
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
        .then((res: AxiosResponse) => {
          setRequestError(undefined);
          setRequestWasCancelled(false);
          response = res;
        })
        .catch(async (err: AxiosError) => {
          if (axios.isCancel(err)) {
            setIsCanceling(true);
            if (queryType === queryTypes.elucidation) {
              await axios.get('http://localhost:8081/webcase-core/cancel');
            }
            setIsCanceling(false);
            setRequestWasCancelled(true);
            setShowQueryPanel(true);
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
              return {
                molfile: molecule.toMolfileV3(),
                dataSet: {
                  ...dataSet,
                  meta: {
                    ...dataSet.meta,
                    querySpectrumSignalCount: Number(
                      dataSet.meta.querySpectrumSignalCount,
                    ),
                    querySpectrumSignalCountWithEquivalences: Number(
                      dataSet.meta.querySpectrumSignalCountWithEquivalences,
                    ),
                    isCompleteSpectralMatch:
                      String(dataSet.meta.isCompleteSpectralMatch) === 'true',
                    isCompleteSpectralMatchWithEquivalences:
                      String(
                        dataSet.meta.isCompleteSpectralMatchWithEquivalences,
                      ) === 'true',
                    rmsd: Number(dataSet.meta.rmsd),
                    averageDeviation: Number(dataSet.meta.averageDeviation),
                    tanimoto: Number(dataSet.meta.tanimoto),
                    setAssignmentsCount: Number(
                      dataSet.meta.setAssignmentsCount,
                    ),
                    setAssignmentsCountWithEquivalences: Number(
                      dataSet.meta.setAssignmentsCountWithEquivalences,
                    ),
                  },
                },
              };
            })
          : [];

      setResult({
        molecules,
        resultID: response ? response.data.resultID : undefined,
        time: (t1 - t0) / 1000,
      });

      if (queryType === queryTypes.detection) {
        setShowQueryPanel(true);
      }
    },
    [nmriumData],
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

  const showResultsPanel = useMemo(
    () =>
      !showQueryPanel && !isRequesting && !requestError && !requestWasCancelled,
    [isRequesting, requestError, requestWasCancelled, showQueryPanel],
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
              onDataChange={handleOnNMRiumDataChange}
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
            <ResultsPanel
              result={result ?? { molecules: [] }}
              onClickClear={() => setResult({ molecules: [] })}
              show={showResultsPanel}
            />
            {!showQueryPanel &&
              !showResultsPanel &&
              (isRequesting ? (
                <Spinner
                  onClickCancel={handleOnCancelRequest}
                  buttonText={isCanceling ? 'Canceling...' : 'Cancel'}
                  buttonDisabled={isCanceling}
                  showTimer={true}
                />
              ) : requestError ? (
                <div className="requestError">
                  <p>Request failed:</p>
                  <p>
                    {requestError.response?.data.errorMessage
                      ? requestError.response?.data.errorMessage
                      : 'Could not connect to WebCASE services'}
                  </p>
                </div>
              ) : requestWasCancelled ? (
                <div className="requestCancelled">
                  <p>Request was cancelled by user!</p>
                </div>
              ) : null)}
          </div>
        </SplitPane>
      </div>
    </div>
  );
}

export default App;
