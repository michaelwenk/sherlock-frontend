import { useEffect, useMemo, useRef, useState } from 'react';
import Cytoscape, {
  ElementDefinition,
  EventObject,
  LayoutOptions,
  Stylesheet,
} from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import CoseBilkent from 'cytoscape-cose-bilkent';
import { useHighlightData } from '../highlight';

Cytoscape.use(CoseBilkent);

interface InputProps {
  graphData: ElementDefinition[];
  styleSheet: Stylesheet[];
  source?: string;
}

function Graph({ graphData, styleSheet, source }: InputProps) {
  const highlightData = useHighlightData();
  const containerRef = useRef<CytoscapeComponent>(null);
  const [cy, setCY] = useState<Cytoscape.Core | undefined>(undefined);

  useEffect(() => {
    if (cy) {
      const addedElementsToHighlight: (
        | Cytoscape.NodeSingular
        | Cytoscape.EdgeSingular
      )[] = [];
      cy.elements().forEach((elem) => {
        if (highlightData.highlight.highlighted.has(elem.data().originalID)) {
          elem.addClass('highlighted');
          if (elem.isNode()) {
            elem.connectedEdges().forEach((edge) => {
              edge.addClass('highlighted');
              addedElementsToHighlight.push(edge);
            });
          }
          if (elem.isEdge()) {
            elem.connectedNodes().forEach((node) => {
              node.addClass('highlighted');
              addedElementsToHighlight.push(node);
            });
          }
        } else {
          elem.removeClass('highlighted');
        }
      });
      addedElementsToHighlight.forEach((elem) => elem.addClass('highlighted'));
    }
  }, [cy, highlightData.highlight.highlighted]);

  useEffect(() => {
    if (cy) {
      const layout = cy.layout({
        name: 'cose-bilkent',
        fit: true,
        padding: 30,
      } as LayoutOptions);
      layout.run();
      cy.on('mouseover', function (e: EventObject) {
        e.preventDefault();
        e.stopPropagation();
        const selectedElementID = e.target._private.data.originalID;
        highlightData.dispatch({
          type: 'SHOW',
          payload: {
            convertedHighlights: new Set([selectedElementID]),
            source,
          },
        });
      });
      cy.on('mouseout', function (e: EventObject) {
        e.preventDefault();
        e.stopPropagation();
        const selectedElementID = e.target._private.data.originalID;
        highlightData.dispatch({
          type: 'HIDE',
          payload: {
            convertedHighlights: new Set([selectedElementID]),
          },
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cy, highlightData.dispatch, graphData]);

  return useMemo(
    () => (
      <CytoscapeComponent
        ref={containerRef}
        elements={graphData}
        cy={(_cy) => setCY(_cy)}
        autounselectify={true}
        style={{
          width: innerWidth,
          height: innerHeight,
        }}
        stylesheet={styleSheet}
      />
    ),
    [graphData, styleSheet],
  );
}

export default Graph;
