import './ResultCard.scss';

import Card from 'react-bootstrap/Card';
import { Molecule } from 'openchemlib/full';
import ResultCardText from './ResultCardText';
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { MolfileSvgRenderer } from 'react-ocl';
import { useHighlightData } from '../../../../highlight';
import PredictionTable from './PredictionTable';
import DataSet from '../../../../../types/sherlock/dataSet/DataSet';
import Button from '../../../../elements/Button';
import { FaAngleDoubleDown, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import SpectrumCompact from '../../../../../types/sherlock/dataSet/SpectrumCompact';

type InputProps = {
  id: string | number;
  dataSet: DataSet;
  querySpectrum: SpectrumCompact;
  imageWidth: number;
  imageHeight: number;
  styles?: CSSProperties;
};

const showPredictionTableStates = {
  hide: 'hide',
  default: 'default',
  extended: 'extended',
};

function ResultCard({
  id,
  dataSet,
  querySpectrum,
  imageWidth,
  imageHeight,
  styles = {},
}: InputProps) {
  const [atomHighlights, setAtomHighlights] = useState<number[]>([]);
  const highlightData = useHighlightData();
  const [showPredictionTableState, setShowPredictionTableState] =
    useState<string>(showPredictionTableStates.hide);

  useEffect(
    () => setShowPredictionTableState(showPredictionTableStates.hide),
    [dataSet],
  );

  useEffect(() => {
    if (dataSet.assignment) {
      const spectralMatchAssignment =
        dataSet.attachment.spectralMatchAssignment;
      const ids: number[] = [];
      dataSet.assignment.assignments[0].forEach(
        (signalArrayInPrediction, signalIndexInPrediction) => {
          const signalIndexInQuerySpectrum =
            spectralMatchAssignment.assignments[0].findIndex(
              (signalArrayQuery) =>
                signalArrayQuery.includes(signalIndexInPrediction),
            );
          if (signalIndexInQuerySpectrum >= 0) {
            if (
              highlightData.highlight.highlighted.has(
                querySpectrum.signals[signalIndexInQuerySpectrum].strings[3],
              )
            ) {
              signalArrayInPrediction.forEach((atomIndex) =>
                ids.push(atomIndex),
              );
            }
          }
        },
      );

      setAtomHighlights(ids);
    }
  }, [
    dataSet.assignment,
    dataSet.attachment.spectralMatchAssignment,
    highlightData.highlight.highlighted,
    querySpectrum.signals,
  ]);

  const handleOnAtom = useCallback(
    (atomIndex, action: 'enter' | 'leave') => {
      if (dataSet.assignment) {
        const signalIndexInPrediction =
          dataSet.assignment.assignments[0].findIndex((atomArray) =>
            atomArray.includes(atomIndex),
          );
        if (signalIndexInPrediction >= 0) {
          const spectralMatchAssignment =
            dataSet.attachment.spectralMatchAssignment;
          const signalIndexInQuerySpectrum =
            spectralMatchAssignment.assignments[0].findIndex(
              (signalArrayQuery) =>
                signalArrayQuery.includes(signalIndexInPrediction),
            );
          if (signalIndexInQuerySpectrum >= 0) {
            highlightData.dispatch({
              type: action === 'enter' ? 'SHOW' : 'HIDE',
              payload: {
                convertedHighlights: [
                  querySpectrum.signals[signalIndexInQuerySpectrum].strings[3],
                ],
              },
            });

            const ids: number[] = [];
            if (action !== 'leave') {
              // add possible equivalent atoms from same group
              const signalIndexInMolecule =
                dataSet.assignment.assignments[0].findIndex((atomArray) =>
                  atomArray.includes(atomIndex),
                );
              if (signalIndexInMolecule >= 0) {
                dataSet.assignment.assignments[0][
                  signalIndexInMolecule
                ].forEach((atomIndex) => {
                  ids.push(atomIndex);
                });
              }
            }
            setAtomHighlights(ids);
          }
        }
      }
    },
    [
      dataSet.assignment,
      dataSet.attachment.spectralMatchAssignment,
      highlightData,
      querySpectrum.signals,
    ],
  );

  const molfile = useMemo((): string => {
    const mol = Molecule.fromMolfile(dataSet.meta.molfile);
    mol.inventCoordinates();

    return mol.toMolfile();
  }, [dataSet.meta.molfile]);

  const cardBody = useMemo(
    () => (
      <Card.Body className="card-body">
        <div
          className="molfile-svg-renderer"
          style={
            {
              '--imageHeight': `${imageHeight}px`,
              '--imageWidth': `${imageWidth}px`,
            } as React.CSSProperties
          }
        >
          <MolfileSvgRenderer
            id={`molSVG_${id}`}
            molfile={molfile}
            width={imageWidth}
            height={imageHeight}
            autoCrop={true}
            autoCropMargin={10}
            atomHighlight={atomHighlights}
            atomHighlightColor="orange"
            atomHighlightOpacity={0.65}
            onAtomEnter={(atomIndex) => handleOnAtom(atomIndex, 'enter')}
            onAtomLeave={(atomIndex) => handleOnAtom(atomIndex, 'leave')}
          />
        </div>

        <div className="result-card-text-container">
          <ResultCardText dataSet={dataSet} />
        </div>
        {
          <div className="prediction-table-container">
            <Button
              onClick={() => {
                setShowPredictionTableState(
                  showPredictionTableState === showPredictionTableStates.hide
                    ? showPredictionTableStates.default
                    : showPredictionTableState ===
                      showPredictionTableStates.default
                    ? showPredictionTableStates.extended
                    : showPredictionTableStates.hide,
                );
              }}
              child={
                showPredictionTableState === showPredictionTableStates.hide ? (
                  <FaAngleDown />
                ) : showPredictionTableState ===
                  showPredictionTableStates.default ? (
                  <FaAngleDoubleDown />
                ) : (
                  <FaAngleUp />
                )
              }
            />
            {showPredictionTableState !== showPredictionTableStates.hide && (
              <PredictionTable
                dataSet={dataSet}
                querySpectrum={querySpectrum}
                atomHighlights={atomHighlights}
                isExtended={
                  showPredictionTableState ===
                  showPredictionTableStates.extended
                }
              />
            )}
          </div>
        }
      </Card.Body>
    ),
    [
      atomHighlights,
      dataSet,
      handleOnAtom,
      id,
      imageHeight,
      imageWidth,
      molfile,
      querySpectrum,
      showPredictionTableState,
    ],
  );

  const cardLink = useMemo(
    () =>
      dataSet.meta.id ? (
        <Card.Link
          href={
            dataSet.meta.source === 'nmrshiftdb'
              ? `http://www.nmrshiftdb.org/molecule/${dataSet.meta.id}`
              : dataSet.meta.source === 'coconut'
              ? `https://coconut.naturalproducts.net/compound/coconut_id/${dataSet.meta.id}`
              : '?'
          }
          target="_blank"
          rel="noreferrer"
          title={`Link to molecule ${dataSet.meta.id} in ${
            dataSet.meta.source === 'nmrshiftdb'
              ? 'NMRShiftDB'
              : dataSet.meta.source === 'coconut'
              ? 'COCONUT'
              : '?'
          }`}
        >
          {dataSet.meta.id}
        </Card.Link>
      ) : null,
    [dataSet.meta.id, dataSet.meta.source],
  );

  return (
    <Card style={styles}>
      <Card.Header>{`#${id}`}</Card.Header>
      {cardBody}
      {cardLink}
    </Card>
  );
}

export default ResultCard;
