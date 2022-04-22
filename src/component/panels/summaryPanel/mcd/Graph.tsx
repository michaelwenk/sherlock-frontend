import { useEffect, useRef, useState } from 'react';
import Cytoscape, { ElementDefinition, EventObject } from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import CoseBilkent from 'cytoscape-cose-bilkent';
import { useHighlightData } from '../../../highlight';

Cytoscape.use(CoseBilkent);

const elementStyleSheet: Cytoscape.Stylesheet[] = [
  {
    selector: 'node',
    css: {
      content: 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'text-wrap': 'none',
      width: '50px',
      height: '50px',
      color: 'pink',
      'background-color': 'beige',
      'border-width': '1px',
      'border-style': 'solid',
      'border-color': 'black',
    },
  },
  {
    selector: 'edge',
    css: {
      width: 2,
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
    },
  },
  {
    selector: '.bond',
    css: {
      width: 3,
      'line-color': 'black',
      'target-arrow-shape': 'none',
      'curve-style': 'straight',
    },
  },
  {
    selector: '.hmbc',
    css: {
      'line-color': 'red',
    },
  },
  {
    selector: '.cosy',
    css: {
      'line-color': 'blue',
      'target-arrow-shape': 'none',
      'curve-style': 'straight',
    },
  },
  {
    selector: '.C',
    css: {
      color: 'black',
    },
  },
  {
    selector: '.O',
    css: {
      color: 'red',
    },
  },
  {
    selector: '.N',
    css: {
      color: 'blue',
    },
  },
  {
    selector: '.Cl',
    css: {
      color: 'green',
    },
  },
  {
    selector: '.Fl',
    css: {
      color: 'green',
    },
  },
  {
    selector: '.S',
    css: {
      color: 'yellow',
    },
  },
  {
    selector: '.P',
    css: {
      color: 'orange',
    },
  },
  {
    selector: '.Br',
    css: {
      color: 'darkred',
    },
  },
  {
    selector: '.I',
    css: {
      color: 'violet',
    },
  },
  {
    selector: '.highlighted',
    css: {
      color: 'red',
      'font-weight': 'bold',
      'font-size': '20px',
      'background-color': 'cyan',
      'line-color': 'black',
      'line-style': 'dashed',
    },
  },
];

interface InputProps {
  graphData: ElementDefinition[];
}

function Graph({ graphData }: InputProps) {
  const highlightData = useHighlightData();

  const containerRef = useRef<CytoscapeComponent>(null);
  const [cy, setCY] = useState<Cytoscape.Core | undefined>(undefined);

  useEffect(() => {
    if (cy) {
      const onTheFlyAddedElementsToHighlight: (
        | Cytoscape.NodeSingular
        | Cytoscape.EdgeSingular
      )[] = [];
      cy.elements().forEach((elem) => {
        if (highlightData.highlight.highlighted.has(elem.data().originalID)) {
          elem.addClass('highlighted');
          if (elem.isNode()) {
            elem.connectedEdges().forEach((edge) => {
              edge.addClass('highlighted');
              onTheFlyAddedElementsToHighlight.push(edge);
            });
          }
          if (elem.isEdge()) {
            elem.connectedNodes().forEach((node) => {
              node.addClass('highlighted');
              onTheFlyAddedElementsToHighlight.push(node);
            });
          }
        } else {
          elem.removeClass('highlighted');
        }
      });
      onTheFlyAddedElementsToHighlight.forEach((elem) => {
        elem.addClass('highlighted');
      });
    }
  }, [cy, highlightData.highlight.highlighted]);

  useEffect(() => {
    if (cy) {
      cy.fit(cy.elements());
      cy.on('mouseover', function (e: EventObject) {
        e.preventDefault();
        e.stopPropagation();
        const selectedElementID = e.target._private.data.originalID;
        highlightData.dispatch({
          type: 'SHOW',
          payload: {
            convertedHighlights: [selectedElementID],
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
            convertedHighlights: [selectedElementID],
          },
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cy, highlightData.dispatch]);

  return (
    <CytoscapeComponent
      ref={containerRef}
      elements={graphData}
      cy={(_cy) => setCY(_cy)}
      layout={{
        name: 'cose-bilkent',
        fit: true,
        padding: 30,
      }}
      autounselectify={true}
      style={{
        width: innerWidth,
        height: innerHeight,
      }}
      stylesheet={elementStyleSheet}
    />
  );
}

export default Graph;
