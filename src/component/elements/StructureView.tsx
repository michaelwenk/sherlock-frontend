import { Molecule } from 'openchemlib';
import { MouseEvent, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { MolfileSvgRenderer } from 'react-ocl';
import DataSet from '../../types/sherlock/dataSet/DataSet';
import SpectrumCompact from '../../types/sherlock/dataSet/SpectrumCompact';
import useHighlightData from '../highlight/useHighlightData';

interface InputProps {
  dataSet: DataSet;
  querySpectrum: SpectrumCompact;
  imageWidth?: number;
  imageHeight?: number;
  onDoubleClick?: () => void;
}

function StructureView({
  dataSet,
  querySpectrum,
  imageWidth,
  imageHeight,
  onDoubleClick = () => {},
}: InputProps) {
  const highlightData = useHighlightData();
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const querySpectrumSignalToAtomIndexAssignment = useMemo(() => {
    const _querySpectrumSignalToAtomIndexAssignment: {
      [signalID: string]: number[];
    } = {};
    if (
      querySpectrum &&
      dataSet.assignment &&
      dataSet.attachment.spectralMatchAssignment
    ) {
      const spectralMatchAssignment =
        dataSet.attachment.spectralMatchAssignment;
      dataSet.assignment.assignments[0].forEach(
        (signalArrayInNonQuerySpectrum, signalIndexInNonQuerySpectrum) => {
          const ids: number[] = [];
          const signalIndexInQuerySpectrum =
            spectralMatchAssignment.assignments[0][
              signalIndexInNonQuerySpectrum
            ][0];
          if (signalIndexInQuerySpectrum >= 0) {
            signalArrayInNonQuerySpectrum.forEach((atomIndex) =>
              ids.push(atomIndex),
            );
            _querySpectrumSignalToAtomIndexAssignment[
              querySpectrum.signals[signalIndexInQuerySpectrum].strings[3]
            ] = ids;
          }
        },
      );
    }

    return _querySpectrumSignalToAtomIndexAssignment;
  }, [
    dataSet.assignment,
    dataSet.attachment.spectralMatchAssignment,
    querySpectrum,
  ]);

  const getSignalIndexInQuerySpectrum = useCallback(
    (atomIndex: number) => {
      if (dataSet.assignment && dataSet.attachment.spectralMatchAssignment) {
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

  const handleOnAtom = useCallback(
    (
      atomIndex: number,
      e: MouseEvent<SVGElement>,
      action: 'enter' | 'leave',
    ) => {
      e.preventDefault();
      e.stopPropagation();

      if (inView && querySpectrum) {
        const signalIndexInQuerySpectrum =
          getSignalIndexInQuerySpectrum(atomIndex);
        if (signalIndexInQuerySpectrum >= 0) {
          const signalID =
            querySpectrum.signals[signalIndexInQuerySpectrum].strings[3];

          if (action === 'enter') {
            const isHighlighted =
              highlightData.highlight.highlighted.has(signalID);
            if (!isHighlighted) {
              highlightData.dispatch({
                type: 'SHOW',
                payload: { convertedHighlights: new Set([signalID]) },
              });
            }
          }
          if (action === 'leave') {
            highlightData.dispatch({
              type: 'HIDE',
              payload: { convertedHighlights: new Set([signalID]) },
            });
          }
        }
      }
    },
    [getSignalIndexInQuerySpectrum, highlightData, inView, querySpectrum],
  );

  const molfile = useMemo((): string => {
    const mol = Molecule.fromMolfile(dataSet.meta.molfile);
    mol.inventCoordinates();

    return mol.toMolfile();
  }, [dataSet.meta.molfile]);

  const atomHighlights = useMemo(() => {
    if (inView) {
      let ids: number[] = [];
      for (const signalID in querySpectrumSignalToAtomIndexAssignment) {
        if (highlightData.highlight.highlighted.has(signalID)) {
          ids = ids.concat(querySpectrumSignalToAtomIndexAssignment[signalID]);
        }
      }
      return ids;
    }
  }, [
    highlightData.highlight.highlighted,
    inView,
    querySpectrumSignalToAtomIndexAssignment,
  ]);

  return useMemo(
    () => (
      <div ref={ref} onDoubleClick={onDoubleClick}>
        <MolfileSvgRenderer
          molfile={molfile}
          width={imageWidth}
          height={imageHeight}
          autoCrop={true}
          autoCropMargin={10}
          atomHighlight={atomHighlights}
          atomHighlightColor="orange"
          atomHighlightOpacity={0.65}
          onAtomEnter={(atomIndex: number, e: MouseEvent<SVGElement>) =>
            handleOnAtom(atomIndex, e, 'enter')
          }
          onAtomLeave={(atomIndex: number, e: MouseEvent<SVGElement>) => {
            handleOnAtom(atomIndex, e, 'leave');
          }}
        />
      </div>
    ),
    [
      atomHighlights,
      handleOnAtom,
      imageHeight,
      imageWidth,
      molfile,
      onDoubleClick,
      ref,
    ],
  );
}

export default StructureView;
