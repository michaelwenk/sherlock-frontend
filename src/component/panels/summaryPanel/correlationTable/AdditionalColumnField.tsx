import { buildLink, getCorrelationIndex, Types } from 'nmr-correlation';
import { useCallback, useMemo } from 'react';
import { useData } from '../../../../context/DataContext';

import { useHighlight } from '../../../highlight';
import { getAbbreviation, getGroupIndex } from '../Utilities';

interface InputProps {
  correlationDim1: Types.Correlation;
  correlationDim2: Types.Correlation;
}

function AdditionalColumnField({
  correlationDim1,
  correlationDim2,
}: InputProps) {
  const { resultData } = useData();

  const commonLinks = useMemo(() => {
    const _commonLinks: Types.Link[] = [];
    correlationDim2.link.forEach((link: Types.Link) => {
      correlationDim1.link.forEach((_link: Types.Link) => {
        if (
          link.axis !== _link.axis &&
          link.experimentID === _link.experimentID &&
          link.signal.id === _link.signal.id &&
          !_commonLinks.some(
            (_commonLink) => _commonLink.signal.id === link.signal.id,
          )
        ) {
          let experimentLabel = link.experimentType;
          if (link.signal && link.signal.sign !== 0) {
            experimentLabel += link.signal.sign === 1 ? ' (+)' : ' (-)';
          }
          _commonLinks.push(
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

    return _commonLinks;
  }, [correlationDim1.link, correlationDim2.link]);

  const highlightIDsCommonLinks = useMemo(() => {
    const ids: string[] = [];
    commonLinks.forEach((link) => {
      if (link.pseudo === false) {
        ids.push(link.signal.id);
      }
    });

    return ids;
  }, [commonLinks]);
  const highlightCommonLinks = useHighlight(highlightIDsCommonLinks);

  const mouseEnterHandler = useCallback(
    (event) => {
      event.currentTarget.focus();
      highlightCommonLinks.show();
    },
    [highlightCommonLinks],
  );
  const mouseLeaveHandler = useCallback(
    (event) => {
      event.currentTarget.blur();
      highlightCommonLinks.hide();
    },
    [highlightCommonLinks],
  );

  const contentLabel = useMemo(
    () =>
      commonLinks.map((commonLink, i) => (
        <label key={commonLink.id}>
          <label
            style={{
              color:
                commonLink.pseudo === true || commonLink.edited?.moved === true
                  ? 'blue'
                  : 'black',
            }}
          >
            {getAbbreviation(commonLink)}
          </label>
          {i < commonLinks.length - 1 && <label>/</label>}
        </label>
      )),
    [commonLinks],
  );

  const title = useMemo(
    () =>
      commonLinks
        .reduce((arr, link) => {
          if (!arr.includes(link.experimentType.toUpperCase())) {
            arr.push(link.experimentType.toUpperCase());
          }
          return arr;
        }, [])
        .join('/'),
    [commonLinks],
  );

  const correlationIndexDim1 = useMemo(
    () =>
      getCorrelationIndex(
        resultData?.resultRecord?.correlations?.values || [],
        correlationDim1,
      ),
    [correlationDim1, resultData?.resultRecord?.correlations?.values],
  );

  const groupIndexDim1 = useMemo(
    () => getGroupIndex(resultData?.resultRecord, correlationDim1),
    [correlationDim1, resultData?.resultRecord],
  );

  const correlationIndexDim2 = useMemo(
    () =>
      getCorrelationIndex(
        resultData?.resultRecord?.correlations?.values || [],
        correlationDim2,
      ),
    [correlationDim2, resultData?.resultRecord?.correlations?.values],
  );

  const groupIndexDim2 = useMemo(
    () => getGroupIndex(resultData?.resultRecord, correlationDim2),
    [correlationDim2, resultData?.resultRecord],
  );

  return (
    <td
      style={{
        backgroundColor: highlightCommonLinks.isActive
          ? '#ff6f0057'
          : 'inherit',
        borderBottom:
          groupIndexDim2 !== -1 &&
          resultData?.resultRecord.grouping?.groups[correlationDim2.atomType]?.[
            groupIndexDim2
          ] &&
          resultData?.resultRecord.grouping?.groups[correlationDim2.atomType]?.[
            groupIndexDim2
          ]?.findIndex((index) => index === correlationIndexDim2) <
            resultData?.resultRecord.grouping?.groups[
              correlationDim2.atomType
            ]?.[groupIndexDim2].length -
              1
            ? 'none'
            : 'solid 1px lightgrey',
        borderRight:
          groupIndexDim1 !== -1 &&
          (resultData?.resultRecord.grouping?.groups[
            correlationDim1.atomType
          ]?.[groupIndexDim1]
            ? resultData?.resultRecord.grouping?.groups[
                correlationDim1.atomType
              ]?.[groupIndexDim1]?.findIndex(
                (index) => index === correlationIndexDim1,
              )
            : 0) > 0
            ? 'none'
            : 'solid 1px lightgrey',
      }}
      title={title}
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
    >
      {contentLabel}
    </td>
  );
}

export default AdditionalColumnField;
