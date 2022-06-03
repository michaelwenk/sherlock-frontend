import { memo, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useData } from '../../../../../context/DataContext';
import DataSet from '../../../../../types/sherlock/dataSet/DataSet';
import SpectrumCompact from '../../../../../types/sherlock/dataSet/SpectrumCompact';
import convertMultiplicityStringToNumber from '../../../../../utils/convertMultiplicityStringToNumber';
import generateID from '../../../../../utils/generateID';
import { useHighlight } from '../../../../highlight';
import highlightSources from '../../../../highlight/highlightSources';

interface InputProps {
  signalIndex: number;
  dataSet: DataSet;
  querySpectrum: SpectrumCompact;
}

function PredictionTableRow({
  signalIndex,
  dataSet,
  querySpectrum,
}: InputProps) {
  const { resultData } = useData();
  const { ref, inView } = useInView({ threshold: 0.8 });

  const signalIndexInQuerySpectrum = useMemo(
    () =>
      dataSet.attachment.spectralMatchAssignment
        ? dataSet.attachment.spectralMatchAssignment.assignments[0][
            signalIndex
          ][0]
        : -1,
    [dataSet.attachment.spectralMatchAssignment, signalIndex],
  );

  const highlightRow = useHighlight(
    inView && signalIndexInQuerySpectrum >= 0
      ? [querySpectrum.signals[signalIndexInQuerySpectrum].strings[3]]
      : [],
    highlightSources.predictionTable,
  );

  const handleOnRow = useCallback(
    (e: any, action: 'enter' | 'leave') => {
      e.preventDefault();
      e.stopPropagation();
      if (inView) {
        if (dataSet.assignment) {
          if (signalIndexInQuerySpectrum >= 0) {
            if (action === 'enter') {
              highlightRow.show();
            } else {
              highlightRow.hide();
            }
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataSet.assignment, inView, signalIndexInQuerySpectrum],
  );

  const range = useMemo(
    () =>
      dataSet.attachment.predictionMeta
        ? Math.abs(
            dataSet.attachment.predictionMeta[signalIndex][2] -
              dataSet.attachment.predictionMeta[signalIndex][3],
          )
        : undefined,
    [dataSet.attachment.predictionMeta, signalIndex],
  );

  const difference = useMemo(() => {
    if (!dataSet.spectrum) {
      return undefined;
    }
    const querySpectrumShift =
      resultData?.resultRecord.querySpectrum?.signals &&
      resultData?.resultRecord.querySpectrum?.signals[
        signalIndexInQuerySpectrum
      ]
        ? resultData?.resultRecord.querySpectrum?.signals[
            signalIndexInQuerySpectrum
          ].doubles[0]
        : undefined;

    return querySpectrumShift
      ? Math.abs(
          querySpectrumShift - dataSet.spectrum.signals[signalIndex].doubles[0],
        )
      : undefined;
  }, [
    dataSet.spectrum,
    resultData?.resultRecord.querySpectrum?.signals,
    signalIndex,
    signalIndexInQuerySpectrum,
  ]);

  return useMemo(
    () => (
      <tr
        key={generateID()}
        ref={ref}
        style={{
          backgroundColor: highlightRow.isActive ? '#ff6f0057' : undefined,
          color: signalIndexInQuerySpectrum < 0 ? '#B5B5B5' : 'black',
        }}
        onMouseEnter={(e) => handleOnRow(e, 'enter')}
        onMouseLeave={(e) => handleOnRow(e, 'leave')}
      >
        <td>
          {dataSet.spectrum
            ? dataSet.spectrum.signals[signalIndex].doubles[0].toFixed(2)
            : ''}
        </td>
        <td>
          {dataSet.spectrum
            ? convertMultiplicityStringToNumber(
                dataSet.spectrum.signals[signalIndex].strings[1],
              )
            : ''}
        </td>
        <td
          style={{
            color:
              dataSet.spectrum &&
              dataSet.spectrum.signals[signalIndex].integers[1] === 1
                ? 'lightgrey'
                : 'inherit',
          }}
        >
          {dataSet.spectrum
            ? dataSet.spectrum.signals[signalIndex].integers[1]
            : ''}
        </td>
        <td
          style={{
            color:
              difference !== undefined
                ? difference < 1
                  ? 'green'
                  : undefined
                : undefined,
            borderRight: '2px solid lightgrey',
          }}
        >
          {difference === undefined ? '-' : difference.toFixed(2)}
        </td>
        {dataSet.attachment.predictionMeta && (
          <>
            <td>
              {dataSet.attachment.predictionMeta[signalIndex][0].toFixed(0)}
            </td>
            <td>
              {dataSet.attachment.predictionMeta[signalIndex][1].toFixed(0)}
            </td>
            <td>{range && range.toFixed(2)}</td>
          </>
        )}
      </tr>
    ),
    [
      dataSet.attachment.predictionMeta,
      dataSet.spectrum,
      difference,
      handleOnRow,
      highlightRow.isActive,
      range,
      ref,
      signalIndex,
      signalIndexInQuerySpectrum,
    ],
  );
}

export default memo(PredictionTableRow);
