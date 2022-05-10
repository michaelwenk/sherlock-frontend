import './EditFixedNeighbors.scss';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import generateID from '../../../../../utils/generateID';
import Button from '../../../../elements/Button';
import SelectBox from '../../../../elements/SelectBox';
import { getCorrelationDelta, Correlation } from 'nmr-correlation';

function buildLabel(
  correlations: Correlation[],
  correlationIndex: number,
): string {
  return `${correlations[correlationIndex].label.origin}: ${
    correlations[correlationIndex].atomType
  }H${correlations[correlationIndex].protonsCount.join(',') || '\u2217'}${
    getCorrelationDelta(correlations[correlationIndex])
      ? ', ' + getCorrelationDelta(correlations[correlationIndex])?.toFixed(2)
      : ''
  }`;
}
interface InputProps {
  fixedNeighborEntry: number[];
  correlations: Correlation[];
  onDelete: Function;
  onAdd: Function;
}

function EditFixedNeighbors({
  fixedNeighborEntry,
  correlations,
  onDelete,
  onAdd,
}: InputProps) {
  const values = useMemo(
    () =>
      correlations
        .filter(
          (correlation) =>
            correlation.atomType !== 'H' &&
            correlation.equivalence === 1 &&
            correlation.protonsCount.length === 1 &&
            correlation.hybridization.length === 1,
        )
        .map((correlation) =>
          buildLabel(
            correlations,
            correlations.findIndex((corr) => corr.id === correlation.id),
          ),
        ),
    [correlations],
  );

  const [newFixedCorrelationIndex, setNewFixedCorrelationIndex] =
    useState<number>(
      values.length > 0
        ? correlations.findIndex(
            (correlation) =>
              correlation.label.origin === values[0].split(':')[0],
          )
        : 0,
    );

  const handleOnDelete = useCallback(
    (fixedCorrelationIndex: number) => {
      onDelete(fixedCorrelationIndex);
    },
    [onDelete],
  );

  const handleOnAdd = useCallback(() => {
    onAdd(newFixedCorrelationIndex);
  }, [newFixedCorrelationIndex, onAdd]);

  const rows = useMemo(() => {
    const _rows = fixedNeighborEntry
      ? fixedNeighborEntry.map((neighborCorrelationIndex) => {
          const labelSplit1 = buildLabel(
            correlations,
            neighborCorrelationIndex,
          ).split(':');
          const labelSplit2 = labelSplit1[1].split(',');
          return (
            <tr key={`neighborCorrelation_${generateID()}`}>
              <td>{labelSplit1[0]}</td>
              <td>{labelSplit2[0].split('H')[1]}</td>
              <td>{labelSplit2[1]}</td>
              <td>
                <Button
                  child={<FaTrashAlt />}
                  onClick={() => handleOnDelete(neighborCorrelationIndex)}
                />
              </td>
            </tr>
          );
        })
      : [];

    _rows.push(
      <tr key={`edit_fixed_neighbors_${generateID()}`}>
        <td colSpan={3}>
          <SelectBox
            key={`selectBox_correlation_new`}
            defaultValue={buildLabel(correlations, newFixedCorrelationIndex)}
            onChange={(value: string) =>
              setNewFixedCorrelationIndex(
                correlations.findIndex(
                  (correlation) =>
                    correlation.label.origin === value.split(':')[0],
                ),
              )
            }
            values={values}
          />
        </td>
        <td>
          <Button child={<FaPlus />} onClick={handleOnAdd} />
        </td>
      </tr>,
    );

    return _rows;
  }, [
    correlations,
    fixedNeighborEntry,
    handleOnAdd,
    handleOnDelete,
    newFixedCorrelationIndex,
    values,
  ]);

  const table = useMemo(() => {
    return (
      rows &&
      rows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Atom</th>
              <th>#H</th>
              <th>Shift</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      )
    );
  }, [rows]);

  return <div className="edit-fixed-neighbors">{table}</div>;
}

export default EditFixedNeighbors;
