import { useEffect, useRef, useState } from 'react';
import Cytoscape, { ElementDefinition, EventObject } from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import CoseBilkent from 'cytoscape-cose-bilkent';
import { useHighlightData } from '../../../highlight';

Cytoscape.use(CoseBilkent);

interface InputProps {
  graphData: ElementDefinition[];
}

function Graph({ graphData }: InputProps) {
  const highlightData = useHighlightData();

  const containerRef = useRef<CytoscapeComponent>(null);
  const [cy, setCY] = useState<Cytoscape.Core | undefined>(undefined);

  useEffect(() => {
    if (cy) {
      let foundInNodes = false;
      cy.nodes().forEach((node) => {
        if (highlightData.highlight.highlighted.has(node.data().originalID)) {
          node.addClass('highlighted');
          node.connectedEdges().forEach((edge) => {
            edge.addClass('highlighted');
          });
          foundInNodes = true;
        } else {
          node.removeClass('highlighted');
          node.connectedEdges().forEach((edge) => {
            edge.removeClass('highlighted');
          });
        }
      });
      if (!foundInNodes) {
        cy.edges().forEach((edge) => {
          if (highlightData.highlight.highlighted.has(edge.data().originalID)) {
            edge.addClass('highlighted');
            edge.connectedNodes().forEach((node) => {
              node.addClass('highlighted');
            });
          } else {
            edge.removeClass('highlighted');
            edge.connectedNodes().forEach((node) => {
              node.removeClass('highlighted');
            });
          }
        });
      }
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
      elements={graphData}
      cy={(_cy) => setCY(_cy)}
      style={{
        width: outerHeight,
        height: innerHeight,
      }}
      stylesheet={[
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
      ]}
      layout={{ name: 'cose-bilkent' }}
      ref={containerRef}
    />
  );
}

export default Graph;