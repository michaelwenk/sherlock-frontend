type HighlightAction = {
  type: HighlightActionTypes;
  payload: {
    convertedHighlights: Set<string>;
    source?: string;
    id?: string;
  };
};

export default HighlightAction;
