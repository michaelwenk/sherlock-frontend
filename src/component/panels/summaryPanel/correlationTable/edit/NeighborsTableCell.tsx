import {
  getAtomCounts,
  getCorrelationDelta,
  getCorrelationIndex,
  Types,
} from 'nmr-correlation';
import { useCallback, useMemo, useState } from 'react';
import { NeighborsEntry } from '../../../../../types/webcase/NeighborsEntry';
import Modal from '../../../../elements/Modal';
import EditNeighbors from './EditNeighbors';
import lodashCloneDeep from 'lodash/cloneDeep';
import { useData } from '../../../../../context/DataContext';
import { useDispatch } from '../../../../../context/DispatchContext';
import {
  EDIT_FORBIDDEN_NEIGHBORS,
  EDIT_SET_NEIGHBORS,
} from '../../../../../context/ActionTypes';

interface InputProps {
  correlation: Types.Correlation;
  neighbors: NeighborsEntry;
  mode: 'forbidden' | 'set';
}

function NeighborsTableCell({ correlation, neighbors, mode }: InputProps) {
  const { nmriumData } = useData();
  const dispatch = useDispatch();

  const [show, setShow] = useState<boolean>(false);

  const handleOnDelete = useCallback(
    (atomType: string, protonCount: number) => {
      const _editedNeighbors = lodashCloneDeep(neighbors);
      if (_editedNeighbors[atomType].includes(protonCount)) {
        _editedNeighbors[atomType].splice(
          _editedNeighbors[atomType].indexOf(protonCount),
          1,
        );
        if (_editedNeighbors[atomType].length === 0) {
          delete _editedNeighbors[atomType];
        }
      } else if (protonCount === -1) {
        delete _editedNeighbors[atomType];
      }
      dispatch({
        type:
          mode === 'forbidden' ? EDIT_FORBIDDEN_NEIGHBORS : EDIT_SET_NEIGHBORS,
        payload: { editedNeighbors: _editedNeighbors, correlation },
      });
    },
    [correlation, dispatch, mode, neighbors],
  );

  const handleOnAdd = useCallback(
    (atomType: string, protonCount: number) => {
      const _editedNeighbors = lodashCloneDeep(neighbors);
      if (!Object.keys(_editedNeighbors).includes(atomType)) {
        _editedNeighbors[atomType] = [];
      }
      if (protonCount >= 0) {
        _editedNeighbors[atomType].push(protonCount);
      }
      dispatch({
        type:
          mode === 'forbidden' ? EDIT_FORBIDDEN_NEIGHBORS : EDIT_SET_NEIGHBORS,
        payload: { editedNeighbors: _editedNeighbors, correlation },
      });
    },
    [correlation, dispatch, mode, neighbors],
  );

  const handleOnClose = useCallback(() => {
    setShow(false);
  }, []);

  const label = useMemo(() => {
    const values = Object.keys(neighbors)
      .map((atomType) => {
        const protonCounts = neighbors[atomType];
        if (Object.keys(protonCounts).length === 0) {
          return `${atomType}`;
        }

        return protonCounts
          .map(
            (protonCount) =>
              // protonCount === 0
              //   ? `q${atomType}`
              //   : `${atomType}H${protonCount > 1 ? protonCount : ''}`,
              `${atomType}H${protonCount}`,
          )
          .flat();
      })
      .flat();
    return <label>{values.join(', ')}</label>;
  }, [neighbors]);

  const possibleNeighbors = useMemo(
    () =>
      nmriumData?.correlations.options && nmriumData?.correlations.options.mf
        ? Object.keys(getAtomCounts(nmriumData.correlations.options.mf)).filter(
            (elem) => elem !== 'H',
          )
        : [],
    [nmriumData],
  );

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setShow(true);
      }}
    >
      {label}
      <Modal
        show={show}
        title={`Edit Forbidden Neighbors: ${correlation.atomType}${
          getCorrelationIndex(nmriumData?.correlations.values, correlation) + 1
        } (${
          getCorrelationDelta(correlation)
            ? `${(getCorrelationDelta(correlation) as number).toFixed(2)} ppm`
            : ''
        })`}
        children={
          <EditNeighbors
            neighbors={neighbors}
            possibleNeighbors={possibleNeighbors}
            onDelete={handleOnDelete}
            onAdd={handleOnAdd}
          />
        }
        onClose={handleOnClose}
      />
    </div>
  );
}

export default NeighborsTableCell;
