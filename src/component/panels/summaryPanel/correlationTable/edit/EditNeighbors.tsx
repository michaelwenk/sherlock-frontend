import './EditNeighbors.scss';

import { memo, useCallback, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../../elements/Button';
import SelectBox from '../../../../elements/SelectBox';
import generateID from '../../../../../utils/generateID';
import NeighborsEntry from '../../../../../types/sherlock/detection/NeighborsEntry';

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
    possibleNeighbors.length > 0 ? possibleNeighbors[0] : '\u2217',
  );
  // eslint-disable-next-line no-unused-vars
  const [newHybridization, setNewHybridization] = useState<number>(-1);
  const [newProtonCount, setNewProtonCount] = useState<number>(-1);

  const handleOnDelete = useCallback(
    (atomType: string, protonCount: number, hybridization: number) => {
      onDelete(atomType, protonCount, hybridization);
    },
    [onDelete],
  );

  const handleOnAdd = useCallback(() => {
    onAdd(newAtomType, newProtonCount, newHybridization);
  }, [newAtomType, newHybridization, newProtonCount, onAdd]);

  const rows = useMemo(() => {
    // const hybridizations = ['\u2217', '1', '2', '3'];
    const protonCounts = ['\u2217', '0', '1', '2', '3'];

    const _rows = Object.keys(neighbors)
      .map((atomType) => {
        const hybridizations = neighbors[atomType];
        if (Object.keys(hybridizations).length === 0) {
          return (
            <tr key={generateID()}>
              <td>{atomType}</td>
              <td>{'\u2217'}</td>
              {/* <td>{'\u2217'}</td> */}
              <td>
                <Button
                  child={<FontAwesomeIcon icon={faTrashAlt} />}
                  onClick={() => handleOnDelete(atomType, -1, -1)}
                />
              </td>
            </tr>
          );
        }

        return Object.keys(hybridizations)
          .map((hybridization) => Number(hybridization))
          .map((hybridization) => {
            if (
              hybridization === -1 &&
              hybridizations[hybridization].length === 0
            ) {
              return (
                <tr key={`hybridization_${generateID()}`}>
                  <td>{atomType}</td>
                  <td>{'\u2217'}</td>
                  {/* <td>{'\u2217'}</td> */}
                  <td>
                    <Button
                      child={<FontAwesomeIcon icon={faTrashAlt} />}
                      onClick={() => handleOnDelete(atomType, -1, -1)}
                    />
                  </td>
                </tr>
              );
            }

            return hybridizations[hybridization].map((protonCount) => (
              <tr key={`hybridization_${generateID()}`}>
                <td>{atomType}</td>
                <td>{protonCount === -1 ? '\u2217' : protonCount}</td>
                {/* <td>{hybridization === -1 ? '\u2217' : hybridization}</td> */}
                <td>
                  <Button
                    child={<FontAwesomeIcon icon={faTrashAlt} />}
                    onClick={() =>
                      handleOnDelete(atomType, protonCount, hybridization)
                    }
                  />
                </td>
              </tr>
            ));
          });
      })
      .flat();

    _rows.push(
      <tr key={`edit_neighbors_${generateID()}`}>
        <td>
          <SelectBox
            key={`selectBox_atomType_new`}
            defaultValue={newAtomType}
            onChange={(value: string) => setNewAtomType(value)}
            values={possibleNeighbors}
          />
        </td>
        <td>
          <SelectBox
            key={`selectBox_protonCount_new`}
            defaultValue={newProtonCount}
            onChange={(value: string) =>
              setNewProtonCount(value === '\u2217' ? -1 : Number(value))
            }
            values={protonCounts}
          />
        </td>
        {/* <td>
          <SelectBox
            key={`selectBox_hybridization_new`}
            defaultValue={newHybridization}
            onChange={(value: string) =>
              setNewHybridization(value === '\u2217' ? -1 : Number(value))
            }
            values={hybridizations}
          />
        </td> */}

        <td>
          <Button
            child={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleOnAdd}
          />
        </td>
      </tr>,
    );

    return _rows;
  }, [
    handleOnAdd,
    handleOnDelete,
    neighbors,
    newAtomType,
    newProtonCount,
    possibleNeighbors,
  ]);

  return useMemo(
    () => (
      <div className="edit-neighbors">
        <table>
          <thead>
            <tr>
              <th>Atom</th>
              <th>#H</th>
              {/* <th>Hybrid</th> */}
              <th></th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    ),
    [rows],
  );
}

export default memo(EditNeighbors);
