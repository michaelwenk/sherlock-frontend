import {
  buildLink,
  Correlation,
  getCorrelationDelta,
  getCorrelationIndex,
  getLabel,
  Link,
} from 'nmr-correlation';
import { memo, MouseEvent, useCallback, useMemo } from 'react';
import { useData } from '../../../../context/DataContext';
import NMRiumData from '../../../../types/nmrium/NMRiumData';

import { useHighlight } from '../../../highlight';
import highlightSources from '../../../highlight/highlightSources';
import { getGroupIndex } from '../Utilities';

import AdditionalColumnField from './AdditionalColumnField';
import HybridizationsTableCell from './edit/HybridizationsTableCell';
import NeighborsTableCell from './edit/NeighborsTableCell';

interface InputProps {
  additionalColumnData: Correlation[];
  correlation: Correlation;
  styleRow;
  styleLabel;
  showAdditionalColumns: boolean;
}

function CorrelationTableRow({
  additionalColumnData,
  correlation,
  styleRow,
  styleLabel,
  showAdditionalColumns,
}: InputProps) {
  const { nmriumData, resultData } = useData();

  const correlationIndex = useMemo(
    () =>
      getCorrelationIndex(nmriumData?.correlations?.values || [], correlation),
    [correlation, nmriumData?.correlations?.values],
  );

  const highlightIDsRow = useMemo(() => {
    const ids: string[] = [];
    ids.push(correlation.id);

    correlation.link.forEach((link: Link) => {
      ids.push(link.signal.id);
    });

    return ids;
  }, [correlation.id, correlation.link]);

  const highlightRow = useHighlight(
    highlightIDsRow,
    highlightSources.correlationTable,
  );

  const mouseEnterHandler = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      highlightRow.show();
    },
    [highlightRow],
  );
  const mouseLeaveHandler = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      highlightRow.hide();
    },
    [highlightRow],
  );

  const groupIndex = useMemo(
    () => getGroupIndex(resultData?.resultRecord, correlation),
    [correlation, resultData?.resultRecord],
  );

  const tableDataProps = useMemo(() => {
    return {
      style: {
        ...styleRow,
        backgroundColor: highlightRow.isActive ? '#ff6f0057' : 'inherit',
        borderBottom:
          groupIndex !== -1 &&
          resultData?.resultRecord.grouping?.groups[correlation.atomType]?.[
            groupIndex
          ] &&
          resultData?.resultRecord.grouping?.groups[correlation.atomType]?.[
            groupIndex
          ]?.findIndex((index) => index === correlationIndex) <
            resultData?.resultRecord.grouping?.groups[correlation.atomType]?.[
              groupIndex
            ].length -
              1
            ? 'none'
            : 'solid 1px lightgrey',
      },
      title:
        correlation.pseudo === false &&
        correlation.link
          .reduce((arr, link) => {
            if (
              link.pseudo === false &&
              !arr.includes(link.experimentType.toUpperCase())
            ) {
              arr.push(link.experimentType.toUpperCase());
            }
            return arr;
          }, [])
          .sort()
          .join('/'),
      onMouseEnter: mouseEnterHandler,
      onMouseLeave: mouseLeaveHandler,
    };
  }, [
    correlation.atomType,
    correlation.link,
    correlation.pseudo,
    correlationIndex,
    groupIndex,
    highlightRow.isActive,
    mouseEnterHandler,
    mouseLeaveHandler,
    resultData?.resultRecord.grouping?.groups,
    styleRow,
  ]);

  const { title, ...otherTableDataProps } = tableDataProps;
  const t = !title ? '' : title;

  const additionalColumnFields = useMemo(() => {
    return additionalColumnData.map((_correlation) => {
      const commonLinks: Link[] = [];
      correlation.link.forEach((link: Link) => {
        _correlation.link.forEach((_link: Link) => {
          if (
            link.axis !== _link.axis &&
            link.experimentID === _link.experimentID &&
            link.signal.id === _link.signal.id &&
            !commonLinks.some(
              (_commonLink) => _commonLink.signal.id === link.signal.id,
            )
          ) {
            let experimentLabel = link.experimentType;
            if (link.signal && link.signal.sign !== 0) {
              experimentLabel += link.signal.sign === 1 ? ' (+)' : ' (-)';
            }
            commonLinks.push(
              buildLink({
                ...link,
                experimentLabel,
                axis: undefined,
                id: `${_link.id}_${link.id}`,
              }),
            );
          }
        });
      });

      return (
        <AdditionalColumnField
          key={`addColData_${correlation.id}_${_correlation.id}`}
          correlationDim1={_correlation}
          correlationDim2={correlation}
        />
      );
    });
  }, [additionalColumnData, correlation]);

  const equivalenceCellStyle = useMemo(() => {
    return correlation.edited.equivalence
      ? { color: 'blue' }
      : {
          color: correlation.equivalence === 1 ? '#bebebe' : 'black',
        };
  }, [correlation]);

  return useMemo(
    () => (
      <tr style={styleRow}>
        <td
          title={t}
          {...{
            ...otherTableDataProps,
            style: { ...tableDataProps.style, styleLabel },
          }}
        >
          {getLabel(nmriumData?.correlations.values, correlation)}
        </td>
        <td title={t} {...otherTableDataProps}>
          {getCorrelationDelta(correlation)
            ? getCorrelationDelta(correlation)?.toFixed(2)
            : ''}
        </td>
        <td
          title={t}
          {...otherTableDataProps}
          style={{
            ...otherTableDataProps.style,
            ...{
              borderRight:
                showAdditionalColumns && correlation.atomType === 'H'
                  ? '1px solid'
                  : undefined,
            },
          }}
        >
          <label style={equivalenceCellStyle}>{correlation.equivalence}</label>
        </td>
        {correlation.atomType != 'H' && (
          <>
            <td title={t} {...otherTableDataProps}>
              {correlation.protonsCount.join(',')}
            </td>
            <td
              title={t}
              {...{
                ...otherTableDataProps,
                style: {
                  ...tableDataProps.style,
                },
              }}
            >
              {correlation.atomType != 'H' ? (
                <HybridizationsTableCell
                  correlation={correlation}
                  hybridizations={Array.from(
                    new Set<number>(
                      (
                        (nmriumData as NMRiumData).correlations.values[
                          correlationIndex
                        ].hybridization || []
                      ).concat(
                        resultData?.resultRecord?.detections
                          ?.detectedHybridizations?.[correlationIndex] || [],
                      ),
                    ),
                  )}
                  highlight={highlightRow}
                />
              ) : (
                ''
              )}
            </td>
            <td
              title={t}
              {...{
                ...otherTableDataProps,
                style: tableDataProps.style,
              }}
            >
              {correlation.atomType != 'H' ? (
                <NeighborsTableCell
                  correlation={correlation}
                  neighbors={
                    resultData?.resultRecord?.detections?.forbiddenNeighbors[
                      correlationIndex
                    ] || {}
                  }
                  mode="forbidden"
                  highlight={highlightRow}
                />
              ) : (
                ''
              )}
            </td>
            <td
              title={t}
              {...{
                ...otherTableDataProps,
                style: {
                  ...tableDataProps.style,
                  borderRight: showAdditionalColumns ? '1px solid' : 'none',
                },
              }}
            >
              {resultData ? (
                <NeighborsTableCell
                  correlation={correlation}
                  neighbors={
                    resultData?.resultRecord?.detections?.setNeighbors[
                      correlationIndex
                    ] || {}
                  }
                  mode="set"
                  highlight={highlightRow}
                />
              ) : (
                ''
              )}
            </td>
          </>
        )}
        {showAdditionalColumns && additionalColumnFields}
      </tr>
    ),
    [
      additionalColumnFields,
      correlation,
      correlationIndex,
      equivalenceCellStyle,
      highlightRow,
      nmriumData,
      otherTableDataProps,
      resultData,
      showAdditionalColumns,
      styleLabel,
      styleRow,
      t,
      tableDataProps.style,
    ],
  );
}

export default memo(CorrelationTableRow);
