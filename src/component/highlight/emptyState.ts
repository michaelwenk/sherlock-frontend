import HighlightContextProps from '../../types/highlight/HighlightContextProps';

const emptyState: HighlightContextProps = {
  highlight: {
    highlights: new Set<string>(),
    highlighted: new Set<string>(),
    source: undefined,
  },
  dispatch: () => null,
  remove: () => null,
};

export default emptyState;
