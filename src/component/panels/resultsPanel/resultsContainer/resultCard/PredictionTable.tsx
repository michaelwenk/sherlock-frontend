import './PredictionTable.scss';
import { CSSProperties, memo, useMemo } from 'react';
import DataSet from '../../../../../types/sherlock/dataSet/DataSet';
import { useData } from '../../../../../context/DataContext';
import SpectrumCompact from '../../../../../types/sherlock/dataSet/SpectrumCompact';
import queryTypes from '../../../../../constants/queryTypes';
import PredictionTableRow from './PredictionTableRow';

type InputProps = {
  dataSet: DataSet;
  querySpectrum: SpectrumCompact;
  isExtended: boolean;
};

function PredictionTable({ dataSet, querySpectrum, isExtended }: InputProps) {
  const { resultData } = useData();

  const rows = useMemo(
    () =>
      (dataSet.spectrum && dataSet.assignment
        ? dataSet.assignment.assignments[0].map(
            (_atomArray: number[], signalIndex) => {
              return {
                shift: (dataSet.spectrum as SpectrumCompact).signals[
                  signalIndex
                ].doubles[0],
                element: (
                  <PredictionTableRow
                    signalIndex={signalIndex}
                    dataSet={dataSet}
                    querySpectrum={querySpectrum}
                    key={`PredictionTable_${dataSet.meta.id}_${signalIndex}`}
                  />
                ),
              };
            },
          )
        : []
      )
        .flat()
        .sort((row1, row2) => row1.shift - row2.shift)
        .map((row) => row.element),
    [dataSet, querySpectrum],
  );

  return useMemo(
    () => (
      <div
        className="prediction-table-container"
        style={
          {
            '--custom-max-height': isExtended ? 'none' : '220px',
          } as CSSProperties
        }
      >
        <table>
          <thead>
            <tr>
              <th>
                {resultData?.queryType === queryTypes.dereplication
                  ? 'Shift'
                  : 'Pred'}
              </th>
              {<th>#H</th>}
              <th>Equ</th>
              {dataSet.attachment.predictionMeta ? (
                <>
                  <th style={{ borderRight: '2px solid lightgrey' }}>Dev</th>
                  <th>Sph</th>
                  <th>Count</th>
                  <th>Range</th>
                </>
              ) : (
                <th>Dev</th>
              )}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    ),
    [
      dataSet.attachment.predictionMeta,
      isExtended,
      resultData?.queryType,
      rows,
    ],
  );
}

export default memo(PredictionTable);
