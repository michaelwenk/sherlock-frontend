import './EditNeighbors.scss';

import { useCallback, useMemo, useState } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { NeighborsEntry } from '../../../../../types/webcase/NeighborsEntry';
import Button from '../../../../elements/Button';
import SelectBox from '../../../../elements/SelectBox';
import generateID from '../../../../../utils/generateID';

interface InputProps {
  neighbors: NeighborsEntry;
  possibleNeighbors: string[];
  onDelete: Function;
  onAdd: Function;
}

function EditNeighbors({
  neighbors,
  possibleNeighbors,
  onDelete,
  onAdd,
}: InputProps) {
  const [newAtomType, setNewAtomType] = useState<string>(
    possibleNeighbors.length > 0 ? possibleNeighbors[0] : '',
  );
  const [newProtonCount, setNewProtonCount] = useState<number>(-1);

  const handleOnDelete = useCallback(
    (atomType: string, protonCount: number) => {
      onDelete(atomType, protonCount);
    },
    [onDelete],
  );

  const handleOnAdd = useCallback(() => {
    onAdd(newAtomType, newProtonCount);
  }, [newAtomType, newProtonCount, onAdd]);

  const rows = useMemo(() => {
    const protonCounts = ['-', '0', '1', '2', '3'];

    const _rows = Object.keys(neighbors)
      .map((atomType) => {
        const protonCounts = neighbors[atomType];

        if (protonCounts.length === 0) {
          return (
            <tr key={`edit_hybridization_${generateID()}`}>
              <td>{atomType}</td>
              <td>{'-'}</td>
              <td>
                <Button
                  child={<FaTrashAlt />}
                  onClick={() => handleOnDelete(atomType, -1)}
                />
              </td>
            </tr>
          );
        }

        return protonCounts.map((protonCount) => (
          <tr key={`edit_hybridization_${generateID()}`}>
            <td>{atomType}</td>
            <td>{protonCount}</td>
            <td>
              <Button
                child={<FaTrashAlt />}
                onClick={() => handleOnDelete(atomType, protonCount)}
              />
            </td>
          </tr>
        ));
      })
      .flat();

    _rows.push(
      <tr key={`edit_neighbors_${generateID()}`}>
        <td>
          <SelectBox
            key={`selectBox_atomType_new`}
            defaultValue={
              possibleNeighbors.length > 0 ? possibleNeighbors[0] : ''
            }
            onChange={(value: string) => setNewAtomType(value)}
            values={possibleNeighbors}
          />
        </td>
        <td>
          <SelectBox
            key={`selectBox_protonCount_new`}
            defaultValue={'-'}
            onChange={(value: string) =>
              setNewProtonCount(value === '-' ? -1 : Number(value))
            }
            values={protonCounts}
          />
        </td>
        <td>
          <Button child={<FaPlus />} onClick={handleOnAdd} />
        </td>
      </tr>,
    );

    return _rows;
  }, [handleOnAdd, handleOnDelete, neighbors, possibleNeighbors]);

  const table = useMemo(() => {
    return (
      <table>
        <thead>
          <tr>
            <th>Atom</th>
            <th>#H</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }, [rows]);

  return <div className="edit-neighbors">{table}</div>;
}

export default EditNeighbors;
