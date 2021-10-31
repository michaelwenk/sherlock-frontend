import './EditHybridizations.scss';

import { useCallback, useMemo, useState } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import Button from '../../../../elements/Button';
import SelectBox from '../../../../elements/SelectBox';
import generateID from '../../../../../utils/generateID';

interface InputProps {
  hybridizations: number[];
  onDelete: Function;
  onAdd: Function;
}

const possibleHybridizations = [1, 2, 3];

function EditHybridizations({ hybridizations, onDelete, onAdd }: InputProps) {
  const [newHybridization, setNewHybridization] = useState<number>(
    possibleHybridizations[2],
  );

  const handleOnDelete = useCallback(
    (hybridization: number) => {
      onDelete(hybridization);
    },
    [onDelete],
  );

  const handleOnAdd = useCallback(() => {
    onAdd(newHybridization);
  }, [newHybridization, onAdd]);

  const rows = useMemo(() => {
    const _rows = hybridizations
      .map((hybridization) => {
        return (
          <tr key={`edit_hybridization_${generateID()}`}>
            <td>{`SP${hybridization}`}</td>
            <td>
              <Button
                child={<FaTrashAlt />}
                onClick={() => handleOnDelete(hybridization)}
              />
            </td>
          </tr>
        );
      })
      .flat();

    _rows.push(
      <tr key={`edit_hybridization_${generateID()}`}>
        <td>
          <SelectBox
            defaultValue={`SP${possibleHybridizations[2]}`}
            onChange={(value: string) =>
              setNewHybridization(Number(value.split('SP')[1]))
            }
            values={possibleHybridizations.map((hybrid) => `SP${hybrid}`)}
          />
        </td>
        <td>
          <Button child={<FaPlus />} onClick={handleOnAdd} />
        </td>
      </tr>,
    );

    return _rows;
  }, [handleOnAdd, handleOnDelete, hybridizations]);

  const table = useMemo(() => {
    return (
      <table>
        <thead>
          <tr>
            <th>Hybridization</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }, [rows]);

  return <div className="edit-hybridizations">{table}</div>;
}

export default EditHybridizations;
