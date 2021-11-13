import { useCallback, useMemo } from 'react';

import { useHighlight } from '../../../highlight';
import { getAbbreviation } from '../Utilities';

function AdditionalColumnField({ commonLinks }) {
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

  return (
    <td
      style={{
        backgroundColor: highlightCommonLinks.isActive
          ? '#ff6f0057'
          : 'inherit',
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
