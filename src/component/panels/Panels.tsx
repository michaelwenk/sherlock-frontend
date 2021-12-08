import './Panels.scss';

import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Canceler,
} from 'axios';
import { Types } from 'nmr-correlation';
import { Spectra } from '@michaelwenk/nmrium';
import { Datum1D } from '@michaelwenk/nmrium/lib/data/types/data1d';
import { Datum2D } from '@michaelwenk/nmrium/lib/data/types/data2d/Datum2D';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import queryTypes from '../../constants/queryTypes';
import { Result } from '../../types/Result';
import Spinner from '../../component/elements/Spinner';
import { HighlightProvider } from '../highlight';
import QueryPanel from './queryPanel/QueryPanel';
import ResultsPanel from './resultsPanel/ResultsPanel';
import SummaryPanel from './summaryPanel/SummaryPanel';
import SplitPane from 'react-split-pane';
import { useData } from '../../context/DataContext';
import { useDispatch } from '../../context/DispatchContext';
import { NMRiumData } from '../../types/nmrium/NMRiumData';
import {
  SET_RESULT_DATA,
  SET_RESULT_DB_ENTRIES,
} from '../../context/ActionTypes';
import { QueryOptions } from '../../types/QueryOptions';
import ResultRecord from '../../types/sherlock/ResultRecord';
import retrievalActions from '../../constants/retrievalAction';

export interface onSubmitProps {
  queryOptions: QueryOptions;
}

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

  const handleOnFetch = useCallback(
    async (_showQueryPanel: boolean) => {
      let response: AxiosResponse | undefined;
      await axios({
        method: 'GET',
        url: 'http://localhost:8081/sherlock-db-service-result/getAllMeta',
        cancelToken: new axios.CancelToken(
          (cancel) => (cancelRequestRef.current = cancel),
        ),
      })
        .then((res: AxiosResponse) => {
          setRequestError(undefined);
          setRequestWasCancelled(false);
          setShowQueryPanel(_showQueryPanel);
          response = res;
        })
        .catch(async (err: AxiosError) => {
          if (axios.isCancel(err)) {
            setRequestWasCancelled(true);
            setShowQueryPanel(_showQueryPanel);
          } else if (axios.isAxiosError(err)) {
            setRequestError(err);
          }
        })
        .finally(() => setIsRequesting(false));

      if (response && response.data) {
        dispatch({
          type: SET_RESULT_DB_ENTRIES,
          payload: { resultRecordList: response.data },
        });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    handleOnFetch(true);
  }, [handleOnFetch]);

  const request = useCallback(
    async (
      config: AxiosRequestConfig,
      queryType: string,
    ): Promise<AxiosResponse | undefined> => {
      let response: AxiosResponse | undefined;
      await axios(config)
        .then((res: AxiosResponse) => {
          setRequestError(undefined);
          setRequestWasCancelled(false);
          setShowQueryPanel(true);
          response = res;
        })
        .catch(async (err: AxiosError) => {
          if (axios.isCancel(err)) {
            setIsCanceling(true);
            if (queryType === queryTypes.elucidation) {
              await axios.get('http://localhost:8081/sherlock-core/cancel');
            }
            setIsCanceling(false);
            setRequestWasCancelled(true);
            setShowQueryPanel(true);
          } else if (axios.isAxiosError(err)) {
            setRequestError(err);
          }
        })
        .finally(() => setIsRequesting(false));

      return response;
    },
    [],
  );

  const handleOnSubmit = useCallback(
    async ({ queryOptions }: onSubmitProps) => {
      setIsRequesting(true);
      setShowQueryPanel(false);

      const {
        queryType,
        dereplicationOptions,
        elucidationOptions,
        detectionOptions,
        retrievalOptions,
      } = queryOptions;

      if (queryType !== queryTypes.retrieval) {
        const data = {
          spectra: nmriumData ? processNMRiumData(nmriumData) : [],
          correlations: nmriumData
            ? {
                ...nmriumData.correlations,
                values: nmriumData.correlations.values.map(
                  (value: Types.Correlation) => {
                    return {
                      ...value,
                      hybridization:
                        typeof value.hybridization == 'string' // @TODO remove the conversion at some point
                          ? value.hybridization.trim().length === 0
                            ? []
                            : [value.hybridization]
                          : value.hybridization,
                    };
                  },
                ),
              }
            : {},
        };
        const requestData = {
          data,
          queryType,
          dereplicationOptions,
          elucidationOptions,
          detectionOptions,
          detections: resultData?.detections,
          resultRecord: {
            id: retrievalOptions.resultID,
            name: retrievalOptions.resultName,
          } as ResultRecord,
        };
        console.log(requestData);

        const t0 = performance.now();
        const requestConfig: AxiosRequestConfig = {
          method: 'POST',
          url: 'http://localhost:8081/sherlock-core/core',
          data: requestData,
          headers: {
            'Content-Type': 'application/json',
          },
          cancelToken: new axios.CancelToken(
            (cancel) => (cancelRequestRef.current = cancel),
          ),
        };
        const response = await request(requestConfig, queryType);
        if (response) {
          const t1 = performance.now();
          console.log(response);
          const resultData: Result = {
            queryType,
            detections: response.data.detections,
            resultRecord: response.data.resultRecord,
            time: (t1 - t0) / 1000,
          };
          dispatch({
            type: SET_RESULT_DATA,
            payload: { resultData },
          });

          if (queryType === queryTypes.detection) {
            handleOnFetch(true);
          } else {
            handleOnFetch(false);
          }
        }
      } else {
        if (retrievalOptions.action === retrievalActions.fetch) {
          handleOnFetch(true);
        } else if (retrievalOptions.action === retrievalActions.deleteAll) {
          const requestConfig: AxiosRequestConfig = {
            method: 'DELETE',
            url: 'http://localhost:8081/sherlock-db-service-result/deleteAll',
            cancelToken: new axios.CancelToken(
              (cancel) => (cancelRequestRef.current = cancel),
            ),
          };
          await request(requestConfig, queryType).then();

          handleOnFetch(true);
        } else if (retrievalOptions.action === retrievalActions.deletion) {
          const requestConfig: AxiosRequestConfig = {
            method: 'DELETE',
            url: 'http://localhost:8081/sherlock-db-service-result/deleteById',
            params: { id: retrievalOptions.resultID },
            cancelToken: new axios.CancelToken(
              (cancel) => (cancelRequestRef.current = cancel),
            ),
          };
          await request(requestConfig, queryType).then();

          handleOnFetch(true);
        } else if (retrievalOptions.action === retrievalActions.retrieve) {
          const requestConfig: AxiosRequestConfig = {
            method: 'GET',
            url: 'http://localhost:8081/sherlock-db-service-result/getById',
            params: { id: retrievalOptions.resultID },
            cancelToken: new axios.CancelToken(
              (cancel) => (cancelRequestRef.current = cancel),
            ),
          };
          const response = await request(requestConfig, queryType);

          if (response) {
            const resultData: Result = {
              queryType,
              resultRecord: response.data,
            };
            dispatch({
              type: SET_RESULT_DATA,
              payload: { resultData },
            });
          }
          setShowQueryPanel(false);
        }
      }
    },
    [dispatch, handleOnFetch, nmriumData, request, resultData?.detections],
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
            <ResultsPanel show={showResultsPanel} />
            {!showQueryPanel &&
              !showResultsPanel &&
              (isRequesting ? (
                <Spinner
                  onClickCancel={handleOnCancelRequest}
                  buttonText={isCanceling ? 'Canceling...' : 'Cancel'}
                  buttonDisabled={isCanceling}
                  showTimer={false}
                />
              ) : requestError ? (
                <div className="request-error">
                  <p>Request failed:</p>
                  <p>
                    {requestError.response?.data.errorMessage
                      ? requestError.response?.data.errorMessage
                      : 'Could not connect to Sherlock`s backend services'}
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
