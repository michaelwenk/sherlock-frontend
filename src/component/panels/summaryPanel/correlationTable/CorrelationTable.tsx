import './CorrelationTable.scss';

import { memo, useCallback, useMemo } from 'react';
import { getLabelColor } from '../Utilities';
import AdditionalColumnHeader from './AdditionalColumnHeader';
import CorrelationTableRow from './CorrelationTableRow';
import { Correlation } from 'nmr-correlation';
import { useData } from '../../../../context/DataContext';
import { useHighlightData } from '../../../highlight';

interface InputPros {
  additionalColumnData: Correlation[];
  showAdditionalColumns: boolean;
  showProtonsAsRows: boolean;
}

function CorrelationTable({
  additionalColumnData,
  showAdditionalColumns,
  showProtonsAsRows,
}: InputPros) {
  const { nmriumData } = useData();
  const highlightData = useHighlightData();

  const rows = useMemo(
    () =>
      nmriumData && nmriumData.correlations
        ? nmriumData.correlations.values
            .filter((correlation) =>
              showProtonsAsRows
                ? correlation.atomType === 'H'
                : correlation.atomType !== 'H',
            )
            .map((correlation) => (
              <CorrelationTableRow
                additionalColumnData={additionalColumnData}
                correlation={correlation}
                key={`correlation${correlation.atomType}${correlation.id}`}
                styleRow={{ backgroundColor: 'mintcream' }}
                styleLabel={
                  correlation.atomType === 'H'
                    ? {
                        color: getLabelColor(
                          nmriumData.correlations,
                          correlation,
                        ),
                      }
                    : {}
                }
                showAdditionalColumns={showAdditionalColumns}
              />
            ))
        : [],
    [
      additionalColumnData,
      nmriumData,
      showAdditionalColumns,
      showProtonsAsRows,
    ],
  );

  const additionalColumnHeader = useMemo(
    () =>
      additionalColumnData.map((correlation) => (
        <AdditionalColumnHeader
          key={`additionalCorrelationHeader_${correlation.id}`}
          correlation={correlation}
        />
      )),
    [additionalColumnData],
  );

  const handleOnScroll = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      highlightData.remove();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [highlightData.remove],
  );

  return useMemo(
    () => (
      <div className="correlation-table" onScroll={handleOnScroll}>
        <table>
          <thead>
            <tr>
              <th>Atom</th>
              <th>δ (ppm)</th>
              <th
                style={
                  showAdditionalColumns && showProtonsAsRows
                    ? { borderRight: '1px solid' }
                    : {}
                }
              >
                Equiv
              </th>
              {!showProtonsAsRows && (
                <>
                  <th>#H</th>
                  <th>Hybrid</th>
                  <th>non-neighbor</th>
                  <th
                    style={
                      showAdditionalColumns ? { borderRight: '1px solid' } : {}
                    }
                  >
                    neighbor
                  </th>
                </>
              )}
              {showAdditionalColumns && additionalColumnHeader}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    ),
    [
      additionalColumnHeader,
      handleOnScroll,
      rows,
      showAdditionalColumns,
      showProtonsAsRows,
    ],
  );
}

export default memo(CorrelationTable);
