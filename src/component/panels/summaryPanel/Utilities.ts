import lodashGet from 'lodash/get';
import { buildLink, Types } from 'nmr-correlation';

import { ErrorColors } from './Constants';

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
  if (link.experimentType === 'hsqc' || link.experimentType === 'hmqc') {
    return !link.signal || link.signal.sign === 0
      ? 'S'
      : `S${link.signal.sign === 1 ? '+' : '-'}`;
  } else if (
    link.experimentType === 'hmbc' ||
    link.experimentType === 'cosy' ||
    link.experimentType === 'tocsy'
  ) {
    return 'M';
  } else if (
    link.experimentType === 'noesy' ||
    link.experimentType === 'roesy'
  ) {
    return 'NOE';
  } else if (link.experimentType === 'inadequate') {
    return 'I';
  } else if (link.experimentType === 'adequate') {
    return 'A';
  }

  return 'X';
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

export { buildNewLink1D, buildNewLink2D, getAbbreviation, getLabelColor };
