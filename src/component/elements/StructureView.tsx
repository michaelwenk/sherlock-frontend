import { Molecule } from 'openchemlib';
import { useCallback, useMemo } from 'react';
import { MolfileSvgRenderer } from 'react-ocl';
import DataSet from '../../types/sherlock/dataSet/DataSet';
import SpectrumCompact from '../../types/sherlock/dataSet/SpectrumCompact';
import generateID from '../../utils/generateID';
import { useHighlightData } from '../highlight';

interface InputProps {
  dataSet: DataSet;
  querySpectrum: SpectrumCompact;
  imageWidth?: number;
  imageHeight?: number;
}

function StructureView({
  dataSet,
  querySpectrum,
  imageWidth,
  imageHeight,
}: InputProps) {
  const highlightData = useHighlightData();
  // const [atomHighlights, setAtomHighlights] = useState<number[]>([]);

  // const querySpectrumSignalToAtomIndexAssignment = useMemo(() => {
  //   const _querySpectrumSignalToAtomIndexAssignment: {
  //     [signalID: string]: number[];
  //   } = {};
  //   const spectralMatchAssignment = dataSet.attachment.spectralMatchAssignment;
  //   if (dataSet.assignment) {
  //     dataSet.assignment.assignments[0].forEach(
  //       (signalArrayInNonQuerySpectrum, signalIndexInNonQuerySpectrum) => {
  //         const ids: number[] = [];
  //         const signalIndexInQuerySpectrum =
  //           spectralMatchAssignment.assignments[0][
  //             signalIndexInNonQuerySpectrum
  //           ][0];
  //         if (signalIndexInQuerySpectrum >= 0) {
  //           signalArrayInNonQuerySpectrum.forEach((atomIndex) =>
  //             ids.push(atomIndex),
  //           );
  //           _querySpectrumSignalToAtomIndexAssignment[
  //             querySpectrum.signals[signalIndexInQuerySpectrum].strings[3]
  //           ] = ids;
  //         }
  //       },
  //     );
  //   }

  //   return _querySpectrumSignalToAtomIndexAssignment;
  // }, [
  //   dataSet.assignment,
  //   dataSet.attachment.spectralMatchAssignment,
  //   querySpectrum.signals,
  // ]);

  const getSignalIndexInQuerySpectrum = useCallback(
    (atomIndex: number) => {
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
            return signalIndexInQuerySpectrum;
          }
        }
      }
      return -1;
    },
    [dataSet.assignment, dataSet.attachment.spectralMatchAssignment],
  );

  // useEffect(() => {
  //   let ids: number[] = [];
  //   for (let signalID in querySpectrumSignalToAtomIndexAssignment) {
  //     if (highlightData.highlight.highlighted.has(signalID)) {
  //       ids = ids.concat(querySpectrumSignalToAtomIndexAssignment[signalID]);
  //     }
  //   }
  //   if (ids.length > 0) {
  //     setAtomHighlights(ids);
  //   }
  // }, [
  //   highlightData.highlight.highlighted,
  //   querySpectrumSignalToAtomIndexAssignment,
  // ]);

  const handleOnAtom = useCallback(
    (atomIndex: number, action: 'enter' | 'leave') => {
      const signalIndexInQuerySpectrum =
        getSignalIndexInQuerySpectrum(atomIndex);
      if (signalIndexInQuerySpectrum >= 0) {
        highlightData.dispatch({
          type: action === 'enter' ? 'SHOW' : 'HIDE',
          payload: {
            convertedHighlights: new Set([
              querySpectrum.signals[signalIndexInQuerySpectrum].strings[3],
            ]),
          },
        });

        // const ids: number[] = [];
        // if (action !== 'leave') {
        //   // add possible equivalent atoms from same group
        //   const signalIndexInMolecule =
        //     dataSet.assignment.assignments[0].findIndex((atomArray) =>
        //       atomArray.includes(atomIndex),
        //     );
        //   if (signalIndexInMolecule >= 0) {
        //     dataSet.assignment.assignments[0][signalIndexInMolecule].forEach(
        //       (atomIndex) => {
        //         ids.push(atomIndex);
        //       },
        //     );
        //   }
        // }
        // setAtomHighlights(ids);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      dataSet.assignment.assignments,
      getSignalIndexInQuerySpectrum,
      // highlightData.dispatch,
      querySpectrum.signals,
    ],
  );

  const molfile = useMemo((): string => {
    const mol = Molecule.fromMolfile(dataSet.meta.molfile);
    mol.inventCoordinates();

    return mol.toMolfile();
  }, [dataSet.meta.molfile]);

  return useMemo(
    () => (
      <MolfileSvgRenderer
        id={`molSVG_${generateID()}`}
        molfile={molfile}
        width={imageWidth}
        height={imageHeight}
        autoCrop={true}
        autoCropMargin={10}
        // atomHighlight={atomHighlights}
        atomHighlightColor="orange"
        atomHighlightOpacity={0.65}
        onAtomEnter={(atomIndex) => handleOnAtom(atomIndex, 'enter')}
        onAtomLeave={(atomIndex) => handleOnAtom(atomIndex, 'leave')}
      />
    ),
    [handleOnAtom, imageHeight, imageWidth, molfile],
  );
}

export default StructureView;
