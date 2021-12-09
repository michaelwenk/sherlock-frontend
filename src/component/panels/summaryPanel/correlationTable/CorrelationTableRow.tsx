import {
  buildLink,
  getCorrelationDelta,
  getCorrelationIndex,
  getLabel,
  Types,
} from 'nmr-correlation';
import { useCallback, useMemo } from 'react';
import { useData } from '../../../../context/DataContext';

import { useHighlight } from '../../../highlight';

import AdditionalColumnField from './AdditionalColumnField';
import HybridizationsTableCell from './edit/HybridizationsTableCell';
import NeighborsTableCell from './edit/NeighborsTableCell';

interface InputProps {
  additionalColumnData: Types.Correlation[];
  correlation: Types.Correlation;
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

  const highlightIDsRow = useMemo(() => {
    if (correlation.pseudo === true) {
      return [];
    }
    const ids: string[] = [];

    correlation.link.forEach((link) => {
      if (link.pseudo === false) {
        ids.push(link.signal.id);
      }
    });

    return ids;
  }, [correlation]);
  const highlightRow = useHighlight(highlightIDsRow);

  const mouseEnterHandler = useCallback(
    (event) => {
      event.currentTarget.focus();
      highlightRow.show();
    },
    [highlightRow],
  );
  const mouseLeaveHandler = useCallback(
    (event) => {
      event.currentTarget.blur();
      highlightRow.hide();
    },
    [highlightRow],
  );

  const tableDataProps = useMemo(() => {
    return {
      style: {
        ...styleRow,
        backgroundColor: highlightRow.isActive ? '#ff6f0057' : 'inherit',
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
    correlation.link,
    correlation.pseudo,
    highlightRow.isActive,
    mouseEnterHandler,
    mouseLeaveHandler,
    styleRow,
  ]);

  const { title, ...otherTableDataProps } = tableDataProps;
  const t = !title ? '' : title;

  const additionalColumnFields = useMemo(() => {
    return additionalColumnData.map((_correlation) => {
      const commonLinks: Types.Link[] = [];
      correlation.link.forEach((link) => {
        _correlation.link.forEach((_link) => {
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
          commonLinks={commonLinks}
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

  return (
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
        {correlation.pseudo === false ? (
          <label style={equivalenceCellStyle}>{correlation.equivalence}</label>
        ) : (
          ''
        )}
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
            {correlation.atomType != 'H' &&
            resultData &&
            resultData.resultRecord.detections ? (
              <HybridizationsTableCell
                correlation={correlation}
                hybridizations={
                  resultData.resultRecord.detections.detectedHybridizations[
                    getCorrelationIndex(
                      nmriumData?.correlations.values,
                      correlation,
                    )
                  ] || []
                }
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
            {correlation.atomType != 'H' &&
            resultData &&
            resultData.resultRecord.detections ? (
              <NeighborsTableCell
                correlation={correlation}
                neighbors={
                  resultData.resultRecord.detections.forbiddenNeighbors[
                    getCorrelationIndex(
                      nmriumData?.correlations.values,
                      correlation,
                    )
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
            {resultData && resultData.resultRecord.detections ? (
              <NeighborsTableCell
                correlation={correlation}
                neighbors={
                  resultData.resultRecord.detections.setNeighbors[
                    getCorrelationIndex(
                      nmriumData?.correlations.values,
                      correlation,
                    )
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
  );
}

export default CorrelationTableRow;
