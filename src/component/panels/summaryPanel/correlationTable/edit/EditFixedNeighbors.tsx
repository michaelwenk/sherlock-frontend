import './EditFixedNeighbors.scss';

import { useCallback, useMemo, useState } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import generateID from '../../../../../utils/generateID';
import Button from '../../../../elements/Button';
import SelectBox from '../../../../elements/SelectBox';
import { Types } from 'nmr-correlation';

interface InputProps {
  fixedNeighborEntry: number[];
  correlations: Types.Correlation[];
  onDelete: Function;
  onAdd: Function;
}

function EditFixedNeighbors({
  fixedNeighborEntry,
  correlations,
  onDelete,
  onAdd,
}: InputProps) {
  const [newFixedCorrelationIndex, setNewFixedCorrelationIndex] =
    useState<number>(0);

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
      ? fixedNeighborEntry.map((neighborCorrelationIndex) => (
          <tr key={`hybridization_${generateID()}`}>
            <td>{`${correlations[neighborCorrelationIndex].label.origin}: ${
              correlations[neighborCorrelationIndex].protonsCount.join(',') ||
              '\u2217'
            }H`}</td>
            <td>
              <Button
                child={<FaTrashAlt />}
                onClick={() => handleOnDelete(neighborCorrelationIndex)}
              />
            </td>
          </tr>
          // SP${
          //   correlations[neighborCorrelationIndex].hybridization.join(',') ||
          //   '\u2217'
          // }
        ))
      : [];

    _rows.push(
      <tr key={`edit_fixed_neighbors_${generateID()}`}>
        <td>
          <SelectBox
            key={`selectBox_correlation_new`}
            defaultValue={`${
              correlations[newFixedCorrelationIndex].label.origin
            }: ${
              correlations[newFixedCorrelationIndex].protonsCount.join(',') ||
              '\u2217'
            }H`}
            onChange={(value: string) =>
              setNewFixedCorrelationIndex(
                correlations.findIndex(
                  (correlation) =>
                    correlation.label.origin === value.split(':')[0],
                ),
              )
            }
            values={correlations
              .filter(
                (correlation) =>
                  correlation.atomType !== 'H' && correlation.equivalence === 1,
              )
              .map(
                (correlation) =>
                  `${correlation.label.origin}: ${
                    correlation.protonsCount.join(',') || '\u2217'
                  }H`,
              )}
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
  ]);

  const table = useMemo(() => {
    return (
      rows &&
      rows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Correlation</th>
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
