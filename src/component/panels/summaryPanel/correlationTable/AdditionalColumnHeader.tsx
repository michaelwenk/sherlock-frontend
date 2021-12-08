import { getCorrelationDelta } from 'nmr-correlation';
import { useCallback, useMemo } from 'react';
import { useData } from '../../../../context/DataContext';

import { useHighlight } from '../../../highlight';
import { getLabelColor } from '../Utilities';

function AdditionalColumnHeader({ correlation }) {
  const { nmriumData } = useData();

  const highlightIDsAdditionalColumn = useMemo(() => {
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
  const highlightAdditionalColumn = useHighlight(highlightIDsAdditionalColumn);

  const mouseEnterHandler = useCallback(
    (event) => {
      event.currentTarget.focus();
      highlightAdditionalColumn.show();
    },
    [highlightAdditionalColumn],
  );
  const mouseLeaveHandler = useCallback(
    (event) => {
      event.currentTarget.blur();
      highlightAdditionalColumn.hide();
    },
    [highlightAdditionalColumn],
  );

  const tableHeaderProps = useMemo(() => {
    return {
      style: {
        ...{
          color:
            getLabelColor(nmriumData?.correlations, correlation) || undefined,
        },
        backgroundColor: highlightAdditionalColumn.isActive
          ? '#ff6f0057'
          : 'inherit',
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
    correlation,
    highlightAdditionalColumn.isActive,
    mouseEnterHandler,
    mouseLeaveHandler,
    nmriumData?.correlations,
  ]);

  const equivalenceTextStyle = useMemo(() => {
    return correlation.edited.equivalence
      ? { backgroundColor: '#F7F2E0' }
      : {
          color: Number.isInteger(correlation.equivalence)
            ? correlation.equivalence === 1
              ? '#bebebe'
              : 'black'
            : 'red',
        };
  }, [correlation]);

  const { title, ...thProps } = tableHeaderProps;

  return (
    <th {...thProps} title={title === false ? undefined : title}>
      <div style={{ display: 'block' }}>
        <p>{correlation.label.origin}</p>
        <p>
          {getCorrelationDelta(correlation)
            ? getCorrelationDelta(correlation)?.toFixed(2)
            : ''}
        </p>
        <p style={equivalenceTextStyle}>
          {Number.isInteger(correlation.equivalence)
            ? correlation.equivalence
            : correlation.equivalence.toFixed(2)}
        </p>
      </div>
    </th>
  );
}

export default AdditionalColumnHeader;
