import lodashGet from 'lodash/get';
import { buildLink, getCorrelationIndex, Types } from 'nmr-correlation';
import ResultRecord from '../../../types/sherlock/ResultRecord';

import { DefaultPathLengths, ErrorColors } from './Constants';

function getLabelColor(correlationData, correlation) {
  const error = lodashGet(
    correlationData,
    `state.${correlation.atomType}.error`,
    null,
  );

  if (error) {
    for (let { key, color } of ErrorColors) {
      if (
        key !== 'incomplete' && // do not consider this for a single atom type
        (key === 'notAttached' || key === 'ambiguousAttachment') &&
        lodashGet(error, `${key}`, []).some(
          (index) => correlationData.values[index].id === correlation.id,
        )
      ) {
        return color;
      }
    }
  }

  return null;
}

function getAbbreviation(link: Types.Link): string {
  let abbreviation = 'X';
  if (link.experimentType === 'hsqc' || link.experimentType === 'hmqc') {
    abbreviation =
      !link.signal || link.signal.sign === 0
        ? 'S'
        : `S${link.signal.sign === 1 ? '+' : '-'}`;
  } else if (
    link.experimentType === 'hmbc' ||
    link.experimentType === 'cosy' ||
    link.experimentType === 'tocsy'
  ) {
    abbreviation = 'M';
  } else if (
    link.experimentType === 'noesy' ||
    link.experimentType === 'roesy'
  ) {
    abbreviation = 'NOE';
  } else if (link.experimentType === 'inadequate') {
    abbreviation = 'I';
  } else if (link.experimentType === 'adequate') {
    abbreviation = 'A';
  }

  const pathLength = link.signal.pathLength;
  if (pathLength) {
    const isDefaultCorrelation =
      DefaultPathLengths[link.experimentType] &&
      pathLength.min >= DefaultPathLengths[link.experimentType].min &&
      pathLength.min <= DefaultPathLengths[link.experimentType].max &&
      pathLength.max >= DefaultPathLengths[link.experimentType].min &&
      pathLength.max <= DefaultPathLengths[link.experimentType].max;

    return `${abbreviation}${isDefaultCorrelation ? '' : '*'}`;
  }

  return abbreviation;
}

function buildNewLink1D(link) {
  return buildLink({
    ...link,
    edited: {
      ...link.edited,
      moved: true,
    },
  });
}

function buildNewLink2D(link: Types.Link, axis: 'x' | 'y') {
  const linkIDs = link.id.split('_');
  return buildLink({
    ...link,
    id: linkIDs[axis === 'x' ? 0 : 1],
    axis,
    match: [],
    edited: {
      ...link.edited,
      moved: true,
    },
  });
}

function getGroupIndex(
  resultRecord: ResultRecord | undefined,
  correlation: Types.Correlation,
) {
  if (resultRecord?.correlations) {
    const correlationIndex = getCorrelationIndex(
      resultRecord.correlations.values,
      correlation,
    );
    const _groupIndex =
      resultRecord.grouping?.transformedGroups[correlation.atomType]?.[
        correlationIndex
      ];

    if (_groupIndex !== undefined) {
      const group =
        resultRecord.grouping?.groups[correlation.atomType]?.[_groupIndex];
      if (group !== undefined && group.length > 1) {
        return _groupIndex;
      }
    }
  }
  return -1;
}

export {
  buildNewLink1D,
  buildNewLink2D,
  getAbbreviation,
  getGroupIndex,
  getLabelColor,
};
