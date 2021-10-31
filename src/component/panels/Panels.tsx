import './Panels.scss';

import axios, { AxiosError, AxiosResponse, Canceler } from 'axios';
import { Types } from 'nmr-correlation';
import { Spectra } from 'nmrium';
import { Datum1D } from 'nmrium/lib/data/data1d/Spectrum1D';
import { Datum2D } from 'nmrium/lib/data/data2d/Spectrum2D';
import { Molecule } from 'openchemlib';
import { useCallback, useMemo, useRef, useState } from 'react';
import queryTypes from '../../constants/queryTypes';
import { Result } from '../../types/Result';
import { ResultMolecule } from '../../types/ResultMolecule';
import Spinner from '../../component/elements/Spinner';
import { DataSet } from '../../types/webcase/DataSet';
import { HighlightProvider } from '../highlight';
import QueryPanel from './queryPanel/QueryPanel';
import ResultsPanel from './resultsPanel/ResultsPanel';
import SummaryPanel from './summaryPanel/SummaryPanel';
import SplitPane from 'react-split-pane';
import { useData } from '../../context/DataContext';
import { useDispatch } from '../../context/DispatchContext';
import { NMRiumData } from '../../types/nmrium/NMRiumData';
import { CLEAR_MOLECULES, SET_RESULT_DATA } from '../../context/ActionTypes';

const minWidth = {
  leftPanel: '25%',
  rightPanel: '25%',
  resizer: '15px',
};

function Panels() {
  const dispatch = useDispatch();
  const { nmriumData, resultData } = useData();

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [showQueryPanel, setShowQueryPanel] = useState<boolean>(true);
  const [requestError, setRequestError] = useState<AxiosError>();
  const [requestWasCancelled, setRequestWasCancelled] =
    useState<boolean>(false);
  const [isCanceling, setIsCanceling] = useState<boolean>(false);
  const cancelRequestRef = useRef<Canceler>();

  const [leftPanelWidth, setLeftPanelWidth] = useState<number>();
  const [hideLeftPanel, setHideLeftPanel] = useState<boolean>(false);
  const [hideRightPanel, setHideRightPanel] = useState<boolean>(false);

  const processNMRiumData = (nmriumData: NMRiumData) =>
    nmriumData && nmriumData.spectra
      ? nmriumData.spectra.reduce<Spectra>((acc, spectrum) => {
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

  const showResultsPanel = useMemo(
    () =>
      !showQueryPanel && !isRequesting && !requestError && !requestWasCancelled,
    [isRequesting, requestError, requestWasCancelled, showQueryPanel],
  );

  const handleOnCancelRequest = useCallback(() => {
    if (cancelRequestRef.current)
      cancelRequestRef.current('User has cancelled the request!!!');
  }, []);

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
        detections: resultData?.detections,
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

      if (response) {
        const resultData: Result = {
          queryType,
          molecules,
          detections: response.data.detections,
          resultID: response.data.resultID,
          time: (t1 - t0) / 1000,
        };
        dispatch({
          type: SET_RESULT_DATA,
          payload: { resultData },
        });
      }

      if (queryType === queryTypes.detection) {
        setShowQueryPanel(true);
      }
    },
    [dispatch, nmriumData, resultData?.detections],
  );

  const handleOnClearResult = useCallback(
    () => dispatch({ type: CLEAR_MOLECULES }),
    [dispatch],
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
    <div className="panels">
      <HighlightProvider>
        <SplitPane
          split="vertical"
          defaultSize="60%"
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
          <SummaryPanel />
          <div className="query-and-result-panel">
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
              onClickClear={handleOnClearResult}
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
                <div className="request-error">
                  <p>Request failed:</p>
                  <p>
                    {requestError.response?.data.errorMessage
                      ? requestError.response?.data.errorMessage
                      : 'Could not connect to WebCASE services'}
                  </p>
                </div>
              ) : requestWasCancelled ? (
                <div className="request-cancelled">
                  <p>Request was cancelled by user!</p>
                </div>
              ) : null)}
          </div>
        </SplitPane>
      </HighlightProvider>
    </div>
  );
}

export default Panels;
