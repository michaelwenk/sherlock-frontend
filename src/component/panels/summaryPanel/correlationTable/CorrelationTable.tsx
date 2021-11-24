import './CorrelationTable.scss';

import { useMemo } from 'react';
import { getLabelColor } from '../Utilities';
import AdditionalColumnHeader from './AdditionalColumnHeader';
import CorrelationTableRow from './CorrelationTableRow';
import { Types } from 'nmr-correlation';
import { useData } from '../../../../context/DataContext';

interface InputPros {
  additionalColumnData: Types.Correlation[];
  showAdditionalColumns: boolean;
  showProtonsAsRows: boolean;
}

function CorrelationTable({
  additionalColumnData,
  showAdditionalColumns,
  showProtonsAsRows,
}: InputPros) {
  const { nmriumData } = useData();

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

  return (
    <div className="correlation-table">
      <table>
        <thead>
          <tr>
            <th>Atom</th>
            <th>δ (ppm)</th>
            <th>Equiv</th>
            <th>#H</th>
            <th>Hybrid</th>
            <th>non-neighbor</th>
            <th
              style={showAdditionalColumns ? { borderRight: '1px solid' } : {}}
            >
              neighbor
            </th>
            {showAdditionalColumns && additionalColumnHeader}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default CorrelationTable;
