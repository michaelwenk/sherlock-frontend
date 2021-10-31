/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useMemo } from 'react';

import { getLabelColor } from '../Utilities';

import AdditionalColumnHeader from './AdditionalColumnHeader';
import CorrelationTableRow from './CorrelationTableRow';
import { Types } from 'nmr-correlation';
import { useData } from '../../../../context/DataContext';

const tableStyle = css`
  overflow: auto;
  height: 95%;
  display: block;
  table {
    border-spacing: 0;
    border: 1px solid #dedede;
    width: 100%;
    font-size: 12px;
    height: 100%;
  }
  tr {
    :last-child {
      td {
        border-bottom: 0;
      }
    }
  }
  thead tr {
    background-color: white !important;
  }
  th {
    position: sticky;
    background-color: white;
    top: 0;
  }

  th,
  td {
    white-space: nowrap;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0.4rem;
    border-bottom: 1px solid #dedede;
    border-right: 1px solid #dedede;

    :last-child {
      border-right: 0;
    }
    button {
      background-color: transparent;
      border: none;
    }
  }
`;

interface InputPros {
  additionalColumnData: Types.Correlation[];
  changeHybridizationSaveHandler: Function;
  showAdditionalColumns: boolean;
}

function CorrelationTable({
  additionalColumnData,
  changeHybridizationSaveHandler,
  showAdditionalColumns,
}: InputPros) {
  const { nmriumData } = useData();

  const rows = useMemo(
    () =>
      nmriumData && nmriumData.correlations
        ? nmriumData.correlations.values
            .filter((correlation) => correlation.atomType !== 'H')
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
                onChangeHybridization={changeHybridizationSaveHandler}
                showAdditionalColumns={showAdditionalColumns}
              />
            ))
        : [],
    [
      additionalColumnData,
      changeHybridizationSaveHandler,
      nmriumData,
      showAdditionalColumns,
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
    <div css={tableStyle}>
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
