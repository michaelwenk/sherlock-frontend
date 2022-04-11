import { Correlation, Link } from 'nmr-correlation';
import { useCallback, useMemo, useRef } from 'react';
import ForceGraph2D, {
  LinkObject,
  NodeObject,
  GraphData,
  ForceGraphMethods,
} from 'react-force-graph-2d';
import { useData } from '../../../context/DataContext';
import { useHighlightData } from '../../highlight';

interface ExtendedNodeObject extends NodeObject {
  label: string;
}
interface ExtendedLinkObject extends LinkObject {
  id: string;
  experimentType: string;
}

function MCD() {
  const { nmriumData, resultData } = useData();
  const highlightData = useHighlightData();
  const ref = useRef<HTMLDivElement>(null);
  const mcdRef = useRef<ForceGraphMethods | undefined>();

  const data = useMemo((): GraphData => {
    const graphData: GraphData = { nodes: [], links: [] };
    const correlations =
      resultData?.resultRecord.correlations || nmriumData?.correlations;
    if (correlations) {
      correlations.values
        .filter((correlation: Correlation) => correlation.atomType !== 'H')
        .forEach((correlation: Correlation) => {
          for (let i = 0; i < correlation.equivalence; i++) {
            const newNode: ExtendedNodeObject = {
              id: correlation.id,
              label:
                correlation.protonsCount.length === 1
                  ? correlation.protonsCount[0] === 0
                    ? correlation.atomType
                    : `${correlation.atomType}H${correlation.protonsCount.join(
                        ',',
                      )}`
                  : correlation.atomType,
            };

            graphData.nodes.push(newNode);
          }
        });
      correlations.values.forEach((correlation: Correlation) =>
        correlation.link.forEach((link: Link) => {
          if (link.match && link.match.length === 1) {
            if (
              link.experimentType === 'hmbc' &&
              correlation.atomType !== 'H'
            ) {
              const otherProtonCorrelation = correlations.values[link.match[0]];
              const hsqcLinksTarget = otherProtonCorrelation.link.filter(
                (_link: Link) =>
                  _link.experimentType === 'hsqc' ||
                  _link.experimentType === 'hmqc',
              );
              if (hsqcLinksTarget.length === 1) {
                const targetIndex =
                  otherProtonCorrelation.attachment[
                    correlations.values[hsqcLinksTarget[0].match[0]].atomType
                  ][0];
                graphData.nodes
                  .filter((node) => node.id === correlation.id)
                  .forEach((node) => {
                    graphData.nodes
                      .filter(
                        (node2) =>
                          node2.id === correlations.values[targetIndex].id,
                      )
                      .forEach((node2) => {
                        const newLink: ExtendedLinkObject = {
                          id: link.id,
                          source: node,
                          target: node2,
                          experimentType: link.experimentType,
                        };
                        graphData.links.push(newLink);
                      });
                  });
              }
            } else if (
              link.experimentType === 'cosy' &&
              correlation.atomType === 'H'
            ) {
              const hsqcLinksSource = correlation.link.filter(
                (_link: Link) =>
                  _link.experimentType === 'hsqc' ||
                  _link.experimentType === 'hmqc',
              );
              const otherProtonCorrelation = correlations.values[link.match[0]];
              const hsqcLinksTarget = otherProtonCorrelation.link.filter(
                (_link: Link) =>
                  _link.experimentType === 'hsqc' ||
                  _link.experimentType === 'hmqc',
              );
              if (
                hsqcLinksSource.length === 1 &&
                hsqcLinksTarget.length === 1
              ) {
                const sourceIndex =
                  correlation.attachment[
                    correlations.values[hsqcLinksSource[0].match[0]].atomType
                  ][0];
                const targetIndex =
                  otherProtonCorrelation.attachment[
                    correlations.values[hsqcLinksTarget[0].match[0]].atomType
                  ][0];
                graphData.nodes
                  .filter(
                    (node) => node.id === correlations.values[sourceIndex].id,
                  )
                  .forEach((node) => {
                    graphData.nodes
                      .filter(
                        (node2) =>
                          node2.id === correlations.values[targetIndex].id,
                      )
                      .forEach((node2) => {
                        const newLink: ExtendedLinkObject = {
                          id: link.id,
                          source: node,
                          target: node2,
                          experimentType: link.experimentType,
                        };
                        graphData.links.push(newLink);
                      });
                  });
              }
            }
          }
        }),
      );
    }

    return graphData;
  }, [nmriumData?.correlations, resultData?.resultRecord.correlations]);

  const handleOnHoverNode = useCallback(
    (nodeOnHover: ExtendedNodeObject | null) => {
      const newHighlightNodes: NodeObject[] = [];
      const newHighlightLinks: LinkObject[] = [];
      const toHighlight: string[] = [];

      if (nodeOnHover) {
        newHighlightNodes.push(nodeOnHover);
        const links = data.links.filter(
          (link) =>
            (link.source as NodeObject).id === nodeOnHover.id ||
            (link.target as NodeObject).id === nodeOnHover.id,
        );
        links.forEach((link) => {
          newHighlightLinks.push(link as ExtendedLinkObject);
          toHighlight.push((link as ExtendedLinkObject).id);
        });
        toHighlight.push(nodeOnHover.id as string);

        // set in highlight data
        highlightData.dispatch({
          type: 'SHOW',
          payload: {
            convertedHighlights: toHighlight,
          },
        });
      } else {
        // set in highlight data
        highlightData.dispatch({
          type: 'HIDE',
          payload: { convertedHighlights: highlightData.highlight.highlighted },
        });
      }
    },
    [data.links, highlightData],
  );

  const handleOnHoverLink = useCallback(
    (linkOnHover: ExtendedLinkObject | null) => {
      const newHighlightNodes: ExtendedNodeObject[] = [];
      const newHighlightLinks: ExtendedLinkObject[] = [];
      if (linkOnHover) {
        newHighlightLinks.push(linkOnHover as ExtendedLinkObject);
        data.nodes
          .filter(
            (node) =>
              (linkOnHover.source as NodeObject).id === node.id ||
              (linkOnHover.target as NodeObject).id === node.id,
          )
          .forEach((node) =>
            newHighlightNodes.push(node as ExtendedNodeObject),
          );
        // set in highlight data
        highlightData.dispatch({
          type: 'SHOW',
          payload: {
            convertedHighlights: [linkOnHover.id],
          },
        });
      } else {
        // set in highlight data
        highlightData.dispatch({
          type: 'HIDE',
          payload: { convertedHighlights: highlightData.highlight.highlighted },
        });
      }
    },
    [data.nodes, highlightData],
  );

  const paintNode = useCallback(
    (node: ExtendedNodeObject, ctx: CanvasRenderingContext2D) => {
      const isHighlighted = highlightData.highlight.highlighted.includes(
        node.id as string,
      );
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.font = isHighlighted ? 'bold 10px arial' : 'normal 8px arial';
      ctx.fillStyle = isHighlighted ? 'red' : 'black';
      ctx.fillText(node.label, node.x as number, node.y as number);
    },
    [highlightData.highlight.highlighted],
  );

  const paintLink = useCallback(
    (link: ExtendedLinkObject, ctx: CanvasRenderingContext2D) => {
      const isHighlighted = highlightData.highlight.highlighted.includes(
        (link as ExtendedLinkObject).id as string,
      );
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.strokeStyle = isHighlighted
        ? 'red'
        : link.experimentType === 'hmbc'
        ? 'magenta'
        : link.experimentType === 'cosy'
        ? 'cyan'
        : 'black';
      ctx.beginPath();
      ctx.moveTo(
        (link.source as ExtendedNodeObject).x as number,
        (link.source as ExtendedNodeObject).y as number,
      );
      ctx.lineTo(
        (link.target as ExtendedNodeObject).x as number,
        (link.target as ExtendedNodeObject).y as number,
      );
      ctx.stroke();
      ctx.closePath();
    },
    [highlightData.highlight.highlighted],
  );

  const handleOnClickAtom = useCallback(
    (node: NodeObject) => {
      if (mcdRef && mcdRef.current) {
        mcdRef.current.zoomToFit(1000, 140, (_node) => _node.id === node.id);
      }
    },
    [mcdRef],
  );

  const resetView = useCallback(() => {
    if (mcdRef && mcdRef.current) {
      mcdRef.current.zoomToFit(1000, 30);
      mcdRef.current.centerAt(0, 0, 1000);
    }
  }, [mcdRef]);

  const handleOnRightClickBackground = useCallback(() => {
    resetView();
  }, [resetView]);

  const graph = useMemo(
    () => (
      <ForceGraph2D
        ref={mcdRef}
        graphData={data}
        nodeCanvasObject={(node, ctx) =>
          paintNode(node as ExtendedNodeObject, ctx)
        }
        linkCanvasObject={(link, ctx) =>
          paintLink(link as ExtendedLinkObject, ctx)
        }
        onNodeHover={(node) => handleOnHoverNode(node as ExtendedNodeObject)}
        onLinkHover={(link) => handleOnHoverLink(link as ExtendedLinkObject)}
        width={ref.current?.clientWidth}
        height={ref.current?.clientHeight}
        onNodeClick={handleOnClickAtom}
        onBackgroundRightClick={handleOnRightClickBackground}
        minZoom={0}
        maxZoom={10}
      />
    ),
    [
      data,
      handleOnClickAtom,
      handleOnHoverLink,
      handleOnHoverNode,
      handleOnRightClickBackground,
      mcdRef,
      paintLink,
      paintNode,
      ref,
    ],
  );
  return (
    <div className="mcd-container" ref={ref}>
      {graph}
    </div>
  );
}

export default MCD;
