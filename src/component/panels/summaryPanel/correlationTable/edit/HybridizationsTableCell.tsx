import {
  Correlation,
  getCorrelationDelta,
  getCorrelationIndex,
} from 'nmr-correlation';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import lodashCloneDeep from 'lodash/cloneDeep';
import { useData } from '../../../../../context/DataContext';
import { useDispatch } from '../../../../../context/DispatchContext';
import EditHybridizations from './EditHybridizations';
import { EDIT_HYBRIDIZATIONS } from '../../../../../context/ActionTypes';
import CustomModal from '../../../../elements/modal/CustomModal';
import Highlight from '../../../../../types/Highlight';

interface InputProps {
  correlation: Correlation;
  hybridizations: number[];
  highlight: Highlight;
}

function HybridizationsTableCell({
  correlation,
  hybridizations,
  highlight,
}: InputProps) {
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
      <label>{hybridizations.map((hybrid) => 'sp' + hybrid).join(', ')}</label>
    );
  }, [hybridizations]);

  useEffect(() => {
    if (show) {
      highlight.hide();
    }
  }, [highlight, show]);

  return useMemo(
    () => (
      <div
        onDoubleClick={(e) => {
          e.stopPropagation();
          setShow(true);
        }}
      >
        {label}
        {show && (
          <CustomModal
            show={show}
            header={`Edit Hybridization: ${correlation.atomType}${
              getCorrelationIndex(
                nmriumData?.correlations.values,
                correlation,
              ) + 1
            } (${
              getCorrelationDelta(correlation)
                ? `${(getCorrelationDelta(correlation) as number).toFixed(
                    2,
                  )} ppm`
                : ''
            })`}
            body={
              <EditHybridizations
                hybridizations={hybridizations}
                onDelete={handleOnDelete}
                onAdd={handleOnAdd}
              />
            }
            onClose={handleOnClose}
          />
        )}
      </div>
    ),
    [
      correlation,
      handleOnAdd,
      handleOnClose,
      handleOnDelete,
      hybridizations,
      label,
      nmriumData?.correlations.values,
      show,
    ],
  );
}

export default memo(HybridizationsTableCell);
