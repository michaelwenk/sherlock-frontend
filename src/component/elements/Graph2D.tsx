import { Correlation, Link } from 'nmr-correlation';
import { useCallback, useMemo, useState } from 'react';
import ForceGraph2D, {
  LinkObject,
  NodeObject,
  GraphData,
} from 'react-force-graph-2d';
import { useData } from '../../context/DataContext';

interface ExtendedNodeObject extends NodeObject {
  title?: string;
  multiplicity?: number;
}
interface ExtendedLinkObject extends LinkObject {
  id: string | number;
  experimentType: string;
  //   title?: string;
}

const NODE_R = 8;

function Graph2D() {
  const { nmriumData, resultData } = useData();

  const [highlightedNodes, setHighlightedNodes] = useState<NodeObject[]>([]);
  const [highlightedLinks, setHighlightedLinks] = useState<LinkObject[]>([]);
  //   const highlights = useHighlight(
  //     ([] as (string | number)[])
  //       .concat(
  //         highlightedNodes.map((node) => node.id as string | number),
  //         highlightedLinks.map(
  //           (link) => (link as ExtendedLinkObject).id as string | number,
  //         ),
  //       )
  //       .flat(),
  //   );

  //   useEffect(() => {
  //     console.log(highlights);
  //   }, [highlights]);

  const data = useMemo((): GraphData => {
    const graphData: GraphData = { nodes: [], links: [] };
    const correlations =
      resultData?.resultRecord.correlations || nmriumData?.correlations;
    if (correlations) {
      correlations.values
        .filter((correlation: Correlation) => correlation.atomType !== 'H')
        .forEach((correlation: Correlation) => {
          const newNode: ExtendedNodeObject = {
            id: correlation.id,
            title: correlation.label.origin || correlation.atomType,
          };
          if (
            correlation.protonsCount !== undefined &&
            correlation.protonsCount.length === 1
          ) {
            newNode.multiplicity = correlation.protonsCount[0];
          }
          graphData.nodes.push(newNode);
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
                (_link) =>
                  _link.experimentType === 'hsqc' ||
                  _link.experimentType === 'hmqc',
              );
              if (hsqcLinksTarget.length === 1) {
                const targetIndex =
                  otherProtonCorrelation.attachment[
                    correlations.values[hsqcLinksTarget[0].match[0]].atomType
                  ][0];
                const newLink: ExtendedLinkObject = {
                  id: link.id,
                  source: graphData.nodes.find(
                    (node) => node.id === correlation.id,
                  ),
                  target: graphData.nodes.find(
                    (node) => node.id === correlations.values[targetIndex].id,
                  ),
                  experimentType: link.experimentType,
                };
                graphData.links.push(newLink);
              }
            } else if (
              link.experimentType === 'cosy' &&
              correlation.atomType === 'H'
            ) {
              const hsqcLinksSource = correlation.link.filter(
                (_link) =>
                  _link.experimentType === 'hsqc' ||
                  _link.experimentType === 'hmqc',
              );
              const otherProtonCorrelation = correlations.values[link.match[0]];
              const hsqcLinksTarget = otherProtonCorrelation.link.filter(
                (_link) =>
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
                const newLink: ExtendedLinkObject = {
                  id: link.id,
                  source: graphData.nodes.find(
                    (node) => node.id === correlations.values[sourceIndex].id,
                  ),
                  target: graphData.nodes.find(
                    (node) => node.id === correlations.values[targetIndex].id,
                  ),
                  experimentType: link.experimentType,
                };
                graphData.links.push(newLink);
              }
            }
          }
        }),
      );
    }
    console.log(graphData);

    return graphData;
  }, [nmriumData?.correlations, resultData?.resultRecord.correlations]);

  const handleOnHoverNode = useCallback(
    (nodeOnHover: NodeObject | null) => {
      const newHighlightNodes: NodeObject[] = [];
      const newHighlightLinks: LinkObject[] = [];
      if (nodeOnHover) {
        newHighlightNodes.push(nodeOnHover);
        const links = data.links.filter(
          (link) =>
            (link.source as NodeObject).id === nodeOnHover.id ||
            (link.target as NodeObject).id === nodeOnHover.id,
        );
        links.forEach((link) => {
          newHighlightLinks.push(link as ExtendedLinkObject);
          const neighborNode = data.nodes.find(
            (node) =>
              node.id !== nodeOnHover.id &&
              ((link.source as NodeObject).id === node.id ||
                (link.target as NodeObject).id === node.id),
          );
          if (neighborNode) {
            newHighlightNodes.push(neighborNode);
          }
        });
      }
      setHighlightedNodes(newHighlightNodes);
      setHighlightedLinks(newHighlightLinks);
    },
    [data.links, data.nodes],
  );

  const handleOnHoverLink = useCallback(
    (link: LinkObject | null) => {
      const newHighlightNodes: ExtendedNodeObject[] = [];
      const newHighlightLinks: ExtendedLinkObject[] = [];
      if (link) {
        newHighlightLinks.push(link as ExtendedLinkObject);
        data.nodes
          .filter(
            (node) =>
              (link.source as NodeObject).id === node.id ||
              (link.target as NodeObject).id === node.id,
          )
          .forEach((node) => newHighlightNodes.push(node));
      }
      setHighlightedNodes(newHighlightNodes);
      setHighlightedLinks(newHighlightLinks);
    },
    [data.nodes],
  );

  const paintNode = useCallback(
    (node: ExtendedNodeObject, ctx: CanvasRenderingContext2D) => {
      const isHighlighted =
        highlightedNodes.find((_node) => _node.id === node.id) !== undefined;
      ctx.beginPath();
      ctx.arc(
        node.x as number,
        node.y as number,
        NODE_R * 1.4,
        0,
        2 * Math.PI,
        false,
      );
      ctx.stroke();
      ctx.closePath();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.font = isHighlighted ? 'bold 11px arial' : 'normal 10px arial';
      ctx.fillStyle = isHighlighted ? 'red' : 'black';
      const text =
        // node.multiplicity !== undefined
        //   ? `${node.title} (${node.multiplicity})`:
        node.title || '?';
      ctx.fillText(text, node.x as number, node.y as number);
    },
    [highlightedNodes],
  );

  const paintLink = useCallback(
    (link: ExtendedLinkObject, ctx: CanvasRenderingContext2D) => {
      const isHighlighted =
        highlightedLinks.find(
          (_link) =>
            (_link as ExtendedLinkObject).id === link.id ||
            (_link.target as ExtendedLinkObject).id === link.id,
        ) !== undefined;
      ctx.beginPath();
      ctx.lineWidth;
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.strokeStyle =
        link.experimentType === 'hmbc'
          ? 'green'
          : link.experimentType === 'cosy'
          ? 'blue'
          : 'black';
      ctx.moveTo(
        (link.source as ExtendedNodeObject).x as number,
        (link.source as ExtendedNodeObject).y as number,
      );
      ctx.lineTo(
        // (link.source as ExtendedNodeObject).x as number,
        // (link.source as ExtendedNodeObject).y as number,
        (link.target as ExtendedNodeObject).x as number,
        (link.target as ExtendedNodeObject).y as number,
        // 1,
      );
      ctx.stroke();
      ctx.closePath();
    },
    [highlightedLinks],
  );

  return (
    <ForceGraph2D
      graphData={data}
      nodeRelSize={NODE_R}
      autoPauseRedraw={false}
      //   nodeCanvasObjectMode={(node: NodeObject) =>
      //     highlightNodes.find((_node) => _node === node) ? 'before' : undefined
      //   }
      linkDirectionalArrowLength={0}
      nodeCanvasObject={(node, ctx) => paintNode(node, ctx)}
      linkCanvasObject={(link, ctx) =>
        paintLink(link as ExtendedLinkObject, ctx)
      }
      onNodeHover={handleOnHoverNode}
      onLinkHover={handleOnHoverLink}
    />
  );
}

export default Graph2D;
