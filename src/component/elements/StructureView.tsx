import { Molecule } from 'openchemlib';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MolfileSvgRenderer } from 'react-ocl';
import DataSet from '../../types/sherlock/dataSet/DataSet';
import SpectrumCompact from '../../types/sherlock/dataSet/SpectrumCompact';
import generateID from '../../utils/generateID';
import { useHighlightData } from '../highlight';

interface InputProps {
  dataSet: DataSet;
  querySpectrum: SpectrumCompact;
  onChangeAtomHighlights?: Function;
  imageWidth?: number;
  imageHeight?: number;
}

function StructureView({
  dataSet,
  querySpectrum,
  onChangeAtomHighlights = () => {},
  imageWidth,
  imageHeight,
}: InputProps) {
  const highlightData = useHighlightData();
  const [atomHighlights, setAtomHighlights] = useState<number[]>([]);

  useEffect(() => {
    if (dataSet.assignment) {
      const spectralMatchAssignment =
        dataSet.attachment.spectralMatchAssignment;
      const ids: number[] = [];
      dataSet.assignment.assignments[0].forEach(
        (signalArrayInPrediction, signalIndexInNonQuerySpectrum) => {
          const signalIndexInQuerySpectrum =
            spectralMatchAssignment.assignments[0][
              signalIndexInNonQuerySpectrum
            ][0];
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
        const signalIndexInNonQuerySpectrum =
          dataSet.assignment.assignments[0].findIndex((atomArray) =>
            atomArray.includes(atomIndex),
          );
        if (signalIndexInNonQuerySpectrum >= 0) {
          const spectralMatchAssignment =
            dataSet.attachment.spectralMatchAssignment;
          const signalIndexInQuerySpectrum =
            spectralMatchAssignment.assignments[0][
              signalIndexInNonQuerySpectrum
            ][0];
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

  useEffect(() => {
    onChangeAtomHighlights(atomHighlights);
  }, [atomHighlights, onChangeAtomHighlights]);

  const molfile = useMemo((): string => {
    const mol = Molecule.fromMolfile(dataSet.meta.molfile);
    mol.inventCoordinates();

    return mol.toMolfile();
  }, [dataSet.meta.molfile]);

  return (
    <MolfileSvgRenderer
      id={`molSVG_${generateID()}`}
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
  );
}

export default StructureView;
