import './Panels.css';

import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Canceler,
} from 'axios';
import { Correlation } from 'nmr-correlation';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import queryTypes from '../../constants/queryTypes';
import Result from '../../types/Result';
import Spinner from '../../component/elements/Spinner';
import QueryPanel from './queryPanel/QueryPanel';
import ResultsPanel from './resultsPanel/ResultsPanel';
import SummaryPanel from './summaryPanel/SummaryPanel';
import { Pane, SplitPane } from 'react-split-pane';
import { useData } from '../../context/DataContext';
import {
  SET_IS_REQUESTING,
  SET_RESULT_DATA,
  SET_RESULT_DB_ENTRIES,
} from '../../context/ActionTypes';
import QueryOptions from '../../types/QueryOptions';
import ResultRecord from '../../types/sherlock/ResultRecord';
import retrievalActions from '../../constants/retrievalAction';
import Button from '../elements/Button';
import HighlightProvider from '../highlight/HighlightProvider';
import { useDispatch } from '../../context/DispatchContext';
import { NmriumState } from '@zakodium/nmrium-core';
import init from '@zakodium/nmrium-core-plugins';

const core = init();

export interface onSubmitProps {
  queryOptions: QueryOptions;
}

function Panels() {
  const dispatch = useDispatch();
  const { nmriumState, resultData, isRequesting } = useData();

  const [showQueryPanel, setShowQueryPanel] = useState<boolean>(true);
  const [requestError, setRequestError] = useState<AxiosError>();
  const [requestWasCancelled, setRequestWasCancelled] =
    useState<boolean>(false);
  const [isCanceling, setIsCanceling] = useState<boolean>(false);
  const cancelRequestRef = useRef<Canceler>(null);

  const showResultsPanel = useMemo(
    () =>
      !showQueryPanel && !isRequesting && !requestError && !requestWasCancelled,
    [isRequesting, requestError, requestWasCancelled, showQueryPanel],
  );

  const handleSetIsRequesting = useCallback(
    (value: boolean) => {
      dispatch({
        type: SET_IS_REQUESTING,
        payload: { isRequesting: value },
      });
    },
    [dispatch],
  );

  const handleOnCancelRequest = useCallback(() => {
    if (cancelRequestRef.current)
      cancelRequestRef.current('User has cancelled the request!!!');
  }, []);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleOnFetch = useCallback(
    async (_showQueryPanel: boolean) => {
      let response: AxiosResponse | undefined;
      await axios({
        method: 'GET',
        url: backendUrl + '/result/getAllMeta',
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
        .finally(() => handleSetIsRequesting(false));

      if (response && response.data) {
        dispatch({
          type: SET_RESULT_DB_ENTRIES,
          payload: { resultRecordList: response.data },
        });
      }
    },
    [backendUrl, dispatch, handleSetIsRequesting],
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
              await axios.get(backendUrl + '/cancel');
            }
            setIsCanceling(false);
            setRequestWasCancelled(true);
            setShowQueryPanel(true);
          } else if (axios.isAxiosError(err)) {
            setRequestError(err);
          }
        })
        .finally(() => handleSetIsRequesting(false));

      return response;
    },
    [backendUrl, handleSetIsRequesting],
  );

  const handleOnSubmit = useCallback(
    async ({ queryOptions }: onSubmitProps) => {
      handleSetIsRequesting(true);
      setShowQueryPanel(false);

      const {
        queryType,
        dereplicationOptions,
        elucidationOptions,
        detectionOptions,
        retrievalOptions,
      } = queryOptions;

      if (queryType !== queryTypes.retrieval) {
        const correlations =
          nmriumState && nmriumState.data
            ? {
                ...nmriumState.data?.correlations,
                values: nmriumState.data?.correlations?.values.map(
                  (value: Correlation) => {
                    return {
                      ...value,
                      hybridization:
                        typeof value.hybridization == 'string' // @TODO remove the conversion at some point
                          ? String(value.hybridization).trim().length === 0
                            ? []
                            : [String(value.hybridization)]
                          : value.hybridization,
                    };
                  },
                ),
              }
            : {};

        const serializedState = core.serializeNmriumState(
          nmriumState as NmriumState,
        );
        const requestData = {
          queryType,
          dereplicationOptions,
          resultRecord: {
            ...resultData?.resultRecord,
            correlations,
            elucidationOptions,
            detectionOptions,
            name: retrievalOptions.resultName,
            nmriumState:
              queryType === queryTypes.elucidation
                ? JSON.stringify(serializedState)
                : null,
          } as ResultRecord,
        };
        console.log(requestData);

        const formData = new FormData();
        formData.append(
          'data',
          new Blob([JSON.stringify(requestData)], { type: 'application/json' }),
        );

        const t0 = performance.now();
        const requestConfig: AxiosRequestConfig = {
          method: 'POST',
          url:
            backendUrl +
            (queryType === queryTypes.elucidation
              ? '/elucidationMultipart'
              : '/core'),
          data: queryType === queryTypes.elucidation ? formData : requestData,

          cancelToken: new axios.CancelToken(
            (cancel) => (cancelRequestRef.current = cancel),
          ),
        };
        const response = await request(requestConfig, queryType);
        if (response) {
          const t1 = performance.now();
          // console.log(response);
          const result: Result = {
            queryType,
            dereplicationOptions: response.data.dereplicationOptions,
            resultRecord: response.data.resultRecord,
            time: (t1 - t0) / 1000,
          };
          console.log(result);

          dispatch({
            type: SET_RESULT_DATA,
            payload: { queryType, resultData: result },
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
            url: backendUrl + '/result/deleteAll',
            cancelToken: new axios.CancelToken(
              (cancel) => (cancelRequestRef.current = cancel),
            ),
          };
          await request(requestConfig, queryType).then();

          handleOnFetch(true);
        } else if (retrievalOptions.action === retrievalActions.deletion) {
          const requestConfig: AxiosRequestConfig = {
            method: 'DELETE',
            url: backendUrl + '/result/deleteById',
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
            url: backendUrl + '/result/getById',
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
            console.log(resultData);

            dispatch({
              type: SET_RESULT_DATA,
              payload: { queryType, resultData },
            });
          }
          setShowQueryPanel(false);
        }
      }
    },
    [
      backendUrl,
      dispatch,
      handleOnFetch,
      handleSetIsRequesting,
      nmriumState,
      request,
      resultData?.resultRecord,
    ],
  );

  return useMemo(
    () => (
      <HighlightProvider>
        <div className="panels">
          <SplitPane
            className="SplitPane"
            dividerClassName="SplitPane-Divider"
            direction="horizontal"
          >
            <Pane className="summary-split-pane">
              <SummaryPanel />
            </Pane>
            <Pane className="query-and-result-split-pane">
              <Button
                type="button"
                className="collapsible"
                onClick={() => {
                  setShowQueryPanel(!showQueryPanel);
                }}
                child={
                  showQueryPanel
                    ? 'Switch to result panel'
                    : 'Switch to query panel'
                }
              />

              <QueryPanel onSubmit={handleOnSubmit} show={showQueryPanel} />
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
                    {axios.isAxiosError(requestError) ? (
                      (
                        requestError.response?.data as {
                          errorMessage: string;
                        }
                      ).errorMessage ? (
                        (
                          requestError.response?.data as {
                            errorMessage: string;
                          }
                        ).errorMessage
                      ) : (
                        <p>
                          <label>
                            Could not connect to Sherlock`s backend services:
                          </label>
                          <br />
                          <label>
                            {JSON.stringify(
                              requestError.response?.data ??
                                requestError.message,
                            )}
                          </label>
                        </p>
                      )
                    ) : (
                      <p>'Could not connect to Sherlock`s backend services' </p>
                    )}
                  </div>
                ) : requestWasCancelled ? (
                  <div className="request-cancelled">
                    <p>Request was cancelled by user!</p>
                  </div>
                ) : null)}
            </Pane>
          </SplitPane>
        </div>
      </HighlightProvider>
    ),
    [
      handleOnCancelRequest,
      handleOnSubmit,
      isCanceling,
      isRequesting,
      requestError,
      requestWasCancelled,
      showQueryPanel,
      showResultsPanel,
    ],
  );
}

export default memo(Panels);
