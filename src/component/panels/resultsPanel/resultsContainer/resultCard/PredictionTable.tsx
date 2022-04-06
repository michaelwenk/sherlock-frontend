import './PredictionTable.scss';
import { CSSProperties, useCallback, useMemo } from 'react';
import DataSet from '../../../../../types/sherlock/dataSet/DataSet';
import { useHighlightData } from '../../../../highlight';
import { useData } from '../../../../../context/DataContext';
import convertMultiplicityStringToNumber from '../../../../../utils/convertMultiplicityStringToNumber';

type InputProps = {
  dataSet: DataSet;
  atomHighlights: number[];
  isExtended: boolean;
};

function PredictionTable({ dataSet, atomHighlights, isExtended }: InputProps) {
  const highlightData = useHighlightData();
  const { resultData } = useData();

  const getSignalIndexInQuerySpectrum = useCallback(
    (signalIndexInPrediction: number) => {
      const spectralMatchAssignment =
        dataSet.attachment.spectralMatchAssignment;
      const signalIndexInQuerySpectrum =
        spectralMatchAssignment.assignments[0].findIndex((signalArrayQuery) =>
          signalArrayQuery.includes(signalIndexInPrediction),
        );

      return signalIndexInQuerySpectrum;
    },
    [dataSet.attachment.spectralMatchAssignment],
  );

  const handleOnAtom = useCallback(
    (signalIndexInPrediction, action: 'enter' | 'leave') => {
      if (dataSet.assignment) {
        if (
          signalIndexInPrediction !== undefined &&
          signalIndexInPrediction >= 0
        ) {
          const signalIndexInQuerySpectrum = getSignalIndexInQuerySpectrum(
            signalIndexInPrediction,
          );
          if (signalIndexInQuerySpectrum >= 0) {
            const toHighlight = [
              `correlation_signal_${signalIndexInQuerySpectrum}`,
            ];

            highlightData.dispatch({
              type: action === 'enter' ? 'SHOW' : 'HIDE',
              payload: {
                convertedHighlights: toHighlight,
              },
            });
          }
        }
      }
    },
    [dataSet.assignment, getSignalIndexInQuerySpectrum, highlightData],
  );

  const rows = useMemo(
    () =>
      dataSet.assignment.assignments[0]
        .map((atomArray: number[], signalIndex) => {
          const range = Math.abs(
            dataSet.attachment.predictionMeta[signalIndex][2] -
              dataSet.attachment.predictionMeta[signalIndex][3],
          );
          const signalIndexInQuerySpectrum =
            getSignalIndexInQuerySpectrum(signalIndex);
          const querySpectrumShift =
            resultData?.resultRecord.querySpectrum?.signals &&
            resultData?.resultRecord.querySpectrum?.signals[
              signalIndexInQuerySpectrum
            ]
              ? resultData?.resultRecord.querySpectrum?.signals[
                  signalIndexInQuerySpectrum
                ].doubles[0]
              : undefined;
          const difference = querySpectrumShift
            ? Math.abs(
                querySpectrumShift -
                  dataSet.spectrum.signals[signalIndex].doubles[0],
              )
            : undefined;

          const atomIndex = atomArray[0];

          return {
            shift: dataSet.spectrum.signals[signalIndex].doubles[0],
            element: (
              <tr
                key={`${dataSet.meta.smiles}_${signalIndex}_${atomIndex}`}
                style={{
                  backgroundColor: atomHighlights.includes(atomIndex)
                    ? '#ff6f0057'
                    : undefined,
                  color: signalIndexInQuerySpectrum < 0 ? '#B5B5B5' : 'black',
                }}
                onMouseEnter={() => handleOnAtom(signalIndex, 'enter')}
                onMouseLeave={() => handleOnAtom(signalIndex, 'leave')}
              >
                <td>
                  {dataSet.spectrum.signals[signalIndex].doubles[0].toFixed(2)}
                </td>
                <td
                  style={{
                    color:
                      dataSet.spectrum.signals[signalIndex].integers[1] === 1
                        ? 'lightgrey'
                        : 'inherit',
                  }}
                >
                  {dataSet.spectrum.signals[signalIndex].integers[1]}
                </td>
                <td>
                  {convertMultiplicityStringToNumber(
                    dataSet.spectrum.signals[signalIndex].strings[1],
                  )}
                </td>
                <td
                  style={{
                    color:
                      difference !== undefined
                        ? difference < 1
                          ? 'green'
                          : difference >= 3
                          ? 'red'
                          : undefined
                        : undefined,
                  }}
                >
                  {difference === undefined ? '-' : difference.toFixed(2)}
                </td>
                <td>
                  {dataSet.attachment.predictionMeta[signalIndex][0].toFixed(0)}
                </td>
                <td>
                  {dataSet.attachment.predictionMeta[signalIndex][1].toFixed(0)}
                </td>
                <td>{range.toFixed(2)}</td>
              </tr>
            ),
          };
        })
        .flat()
        .sort((row1, row2) => row1.shift - row2.shift)
        .map((row) => row.element),
    [
      atomHighlights,
      dataSet.assignment.assignments,
      dataSet.attachment.predictionMeta,
      dataSet.meta.smiles,
      dataSet.spectrum.signals,
      getSignalIndexInQuerySpectrum,
      handleOnAtom,
      resultData?.resultRecord.querySpectrum?.signals,
    ],
  );

  return (
    <div
      className="prediction-table"
      style={
        {
          '--custom-max-height': isExtended ? 'none' : '250px',
        } as CSSProperties
      }
    >
      <table>
        <thead>
          <tr>
            <th>Shift</th>
            <th>Equ</th>
            <th>#H</th>
            <th>Dev</th>
            <th>Sph</th>
            <th>Count</th>
            <th>Range</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default PredictionTable;
