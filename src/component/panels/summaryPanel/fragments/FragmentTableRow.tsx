import { memo, useCallback, useMemo, useState } from 'react';
import {
  DELETE_FRAGMENT,
  EDIT_FRAGMENT,
  EDIT_INCLUDE_FRAGMENT,
} from '../../../../context/ActionTypes';
import { useDispatch } from '../../../../context/DispatchContext';
import DataSet from '../../../../types/sherlock/dataSet/DataSet';
import SpectrumCompact from '../../../../types/sherlock/dataSet/SpectrumCompact';
import CheckBox from '../../../elements/CheckBox';
import StructureEditorModal from '../../../elements/modal/StructureEditorModal';
import StructureView from '../../../elements/StructureView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Button from '../../../elements/Button';

interface InputProps {
  index: number;
  fragment: DataSet;
  querySpectrum: SpectrumCompact;
}

function FragmentsTableRow({ index, fragment, querySpectrum }: InputProps) {
  const dispatch = useDispatch();
  const [showFragmentEditor, setShowFragmentEditor] = useState<boolean>(false);

  const handleOnChangeInclude = useCallback(
    (value: boolean) => {
      dispatch({
        type: EDIT_INCLUDE_FRAGMENT,
        payload: { index, value },
      });
    },
    [dispatch, index],
  );

  const handleOnDelete = useCallback(() => {
    dispatch({
      type: DELETE_FRAGMENT,
      payload: { index },
    });
  }, [dispatch, index]);

  const handleOnDoubleClick = useCallback(() => {
    setShowFragmentEditor(true);
  }, []);

  const handleOnCloseFragmentEditor = useCallback(
    () => setShowFragmentEditor(false),
    [],
  );

  const handleOnSaveFragmentEditor = useCallback(
    (molfile: string | undefined) => {
      if (molfile) {
        dispatch({
          type: EDIT_FRAGMENT,
          payload: { index, molfile },
        });
      } else {
        handleOnDelete();
      }
    },
    [dispatch, handleOnDelete, index],
  );

  return useMemo(
    () => (
      <tr key={`fragment_table_row_${index}`}>
        <td style={{ width: '10%' }}>{index + 1}</td>
        <td style={{ width: '60%' }}>
          <StructureView
            dataSet={fragment}
            querySpectrum={querySpectrum}
            onDoubleClick={handleOnDoubleClick}
          />
        </td>
        <td style={{ width: '10%' }}>
          <p>
            {fragment.attachment.averageDeviation
              ? fragment.attachment.averageDeviation.toFixed(2)
              : ''}
          </p>
        </td>
        <td style={{ width: '10%' }}>
          <CheckBox
            defaultValue={fragment.attachment.include}
            onChange={(value: boolean) => handleOnChangeInclude(value)}
          />
        </td>
        <td style={{ width: '10%' }}>
          <Button
            child={
              <FontAwesomeIcon icon={faTrashAlt} title="Delete fragment" />
            }
            onClick={handleOnDelete}
            style={{
              border: 'none',
            }}
          />
        </td>
        {fragment.attachment.custom && showFragmentEditor && (
          <StructureEditorModal
            onClose={handleOnCloseFragmentEditor}
            onSave={handleOnSaveFragmentEditor}
            initialMolfile={fragment.meta.molfile}
          />
        )}
      </tr>
    ),
    [
      fragment,
      handleOnChangeInclude,
      handleOnCloseFragmentEditor,
      handleOnDelete,
      handleOnDoubleClick,
      handleOnSaveFragmentEditor,
      index,
      querySpectrum,
      showFragmentEditor,
    ],
  );
}

export default memo(FragmentsTableRow);
