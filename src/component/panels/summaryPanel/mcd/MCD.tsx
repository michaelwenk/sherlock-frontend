import './MCD.scss';

import { Correlation, Link } from 'nmr-correlation';
import { memo, useMemo } from 'react';
import { useData } from '../../../../context/DataContext';
import generateID from '../../../../utils/generateID';
import Graph from '../../../elements/Graph';
import { ElementDefinition } from 'cytoscape';
import styleSheet from './stylesheet';
import highlightSources from '../../../highlight/highlightSources';

function MCD() {
  const { nmriumData, resultData } = useData();

  const graphData = useMemo(() => {
    const _graphData: ElementDefinition[] = [];
    const correlations =
      resultData?.resultRecord.correlations || nmriumData?.correlations;
    if (correlations) {
      correlations.values
        .filter((correlation: Correlation) => correlation.atomType !== 'H')
        .forEach((correlation: Correlation) => {
          for (let i = 0; i < correlation.equivalence; i++) {
            const newNode: ElementDefinition = {
              data: {
                id: generateID(),
                originalID: correlation.id,
                label:
                  correlation.protonsCount.length === 1
                    ? correlation.protonsCount[0] === 0
                      ? correlation.atomType
                      : `${correlation.atomType}H${
                          correlation.protonsCount[0] === 1
                            ? ''
                            : correlation.protonsCount.join(',')
                        }`
                    : correlation.atomType,
                atomType: correlation.atomType,
              },
              classes: correlation.atomType,
            };
            _graphData.push(newNode);
          }
        });
      correlations.values.forEach(
        (correlation: Correlation, correlationIndex: number) => {
          if (
            resultData?.resultRecord.detections &&
            resultData?.resultRecord.detections.fixedNeighbors &&
            resultData.resultRecord.detections.fixedNeighbors[correlationIndex]
          ) {
            resultData.resultRecord.detections.fixedNeighbors[
              correlationIndex
            ].forEach((fixedNeighborCorrelationIndex: number) => {
              const id = generateID();
              const newLink: ElementDefinition = {
                data: {
                  id,
                  originalID: id,
                  source: _graphData.find(
                    (elem) => elem.data.originalID === correlation.id,
                  )?.data.id,
                  target: _graphData.find(
                    (elem) =>
                      elem.data.originalID ===
                      correlations.values[fixedNeighborCorrelationIndex].id,
                  )?.data.id,
                },
                classes: 'bond',
              };
              _graphData.push(newLink);
            });
          }
          correlation.link.forEach((link: Link) => {
            if (link.match && link.match.length === 1) {
              if (
                link.experimentType === 'hmbc' &&
                correlation.atomType !== 'H'
              ) {
                const otherProtonCorrelation =
                  correlations.values[link.match[0]];
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
                  _graphData
                    .filter((elem) => elem.data.originalID === correlation.id)
                    .forEach((elem) => {
                      _graphData
                        .filter(
                          (elem2) =>
                            elem2.data.originalID ===
                            correlations.values[targetIndex].id,
                        )
                        .forEach((elem2) => {
                          // avoid loops
                          if (elem.data.id !== elem2.data.id) {
                            const newLink: ElementDefinition = {
                              data: {
                                id:
                                  elem.data.id +
                                  '_' +
                                  elem2.data.id +
                                  '_' +
                                  link.experimentType,
                                originalID: link.id,
                                source: elem.data.id,
                                target: elem2.data.id,
                              },
                              classes: link.experimentType,
                            };
                            _graphData.push(newLink);
                          }
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
                const otherProtonCorrelation =
                  correlations.values[link.match[0]];
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
                  _graphData
                    .filter(
                      (elem) =>
                        elem.data.originalID ===
                        correlations.values[sourceIndex].id,
                    )
                    .forEach((elem) => {
                      _graphData
                        .filter(
                          (elem2) =>
                            elem2.data.originalID ===
                            correlations.values[targetIndex].id,
                        )
                        .forEach((elem2) => {
                          if (elem.data.id !== elem2.data.id) {
                            const newLink: ElementDefinition = {
                              data: {
                                id:
                                  elem.data.id +
                                  '_' +
                                  elem2.data.id +
                                  '_' +
                                  link.experimentType,
                                originalID: link.id,
                                source: elem.data.id,
                                target: elem2.data.id,
                              },
                              classes: link.experimentType,
                            };
                            _graphData.push(newLink);
                          }
                        });
                    });
                }
              }
            }
          });
        },
      );
    }

    return _graphData;
  }, [
    nmriumData?.correlations,
    resultData?.resultRecord.correlations,
    resultData?.resultRecord.detections,
  ]);

  return useMemo(
    () => (
      <div className="mcd-container">
        <Graph
          graphData={graphData}
          styleSheet={styleSheet}
          source={highlightSources.mcd}
        />
      </div>
    ),
    [graphData],
  );
}

export default memo(MCD);
