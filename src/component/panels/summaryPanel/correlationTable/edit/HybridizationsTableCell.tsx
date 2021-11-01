import {
  getCorrelationDelta,
  getCorrelationIndex,
  Types,
} from 'nmr-correlation';
import { useCallback, useMemo, useState } from 'react';
import lodashCloneDeep from 'lodash/cloneDeep';
import { useData } from '../../../../../context/DataContext';
import { useDispatch } from '../../../../../context/DispatchContext';
import Modal from '../../../../elements/Modal';
import EditHybridizations from './EditHybridizations';
import { EDIT_HYBRIDIZATIONS } from '../../../../../context/ActionTypes';

interface InputProps {
  correlation: Types.Correlation;
  hybridizations: number[];
}

function HybridizationsTableCell({ correlation, hybridizations }: InputProps) {
  const { nmriumData } = useData();
  const dispatch = useDispatch();

  const [show, setShow] = useState<boolean>(false);

  const handleOnDelete = useCallback(
    (hybridization: number) => {
      const _editedHybridizations = lodashCloneDeep(hybridizations);
      if (_editedHybridizations.includes(hybridization)) {
        _editedHybridizations.splice(
          _editedHybridizations.indexOf(hybridization),
          1,
        );
      }
      dispatch({
        type: EDIT_HYBRIDIZATIONS,
        payload: { editedHybridizations: _editedHybridizations, correlation },
      });
    },
    [correlation, dispatch, hybridizations],
  );

  const handleOnAdd = useCallback(
    (hybridization: number) => {
      const _editedHybridizations = lodashCloneDeep(hybridizations);
      if (!_editedHybridizations.includes(hybridization)) {
        _editedHybridizations.push(hybridization);
      }
      _editedHybridizations.sort();
      dispatch({
        type: EDIT_HYBRIDIZATIONS,
        payload: { editedHybridizations: _editedHybridizations, correlation },
      });
    },
    [correlation, dispatch, hybridizations],
  );

  const handleOnClose = useCallback(() => {
    setShow(false);
  }, []);

  const label = useMemo(() => {
    return (
      <label>{hybridizations.map((hybrid) => 'SP' + hybrid).join(', ')}</label>
    );
  }, [hybridizations]);

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
        title={`Edit Hybridization: ${correlation.atomType}${
          getCorrelationIndex(nmriumData?.correlations.values, correlation) + 1
        } (${
          getCorrelationDelta(correlation)
            ? `${(getCorrelationDelta(correlation) as number).toFixed(2)} ppm`
            : ''
        })`}
        children={
          <EditHybridizations
            hybridizations={hybridizations}
            onDelete={handleOnDelete}
            onAdd={handleOnAdd}
          />
        }
        onClose={handleOnClose}
      />
    </div>
  );
}

export default HybridizationsTableCell;
