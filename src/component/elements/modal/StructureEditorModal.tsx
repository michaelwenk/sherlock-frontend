import { useCallback, useMemo, useState } from 'react';
import { StructureEditor } from 'react-ocl/full';
import Button from '../Button';
import CustomModal from './CustomModal';

interface InputProps {
  show: boolean;
  // eslint-disable-next-line no-unused-vars
  setShow: (value: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  onSave?: (molfile: string | undefined) => void;
  molfile?: string;
}

function StructureEditorModal({
  show,
  setShow,
  // eslint-disable-next-line no-unused-vars
  onSave = (molfile: string | undefined) => {},
  molfile,
}: InputProps) {
  const [structureMolfile, setStructureMolfile] = useState<
    string | undefined
  >();

  const handleOnChangeStructure = useCallback(
    (molfile: string) => setStructureMolfile(molfile),
    [],
  );

  const handleOnSave = useCallback(
    () => onSave(structureMolfile),
    [onSave, structureMolfile],
  );

  return useMemo(
    () => (
      <CustomModal
        show={show}
        header="Add or edit custom fragment"
        body={
          <div>
            <StructureEditor
              width={500}
              onChange={handleOnChangeStructure}
              initialMolfile={molfile}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                child="Cancel"
                onClick={() => {
                  setShow(false);
                }}
              />
              <Button
                child="Save"
                onClick={() => {
                  setShow(false);
                  handleOnSave();
                }}
              />
            </div>
          </div>
        }
        modalStyle={{ content: { width: '500px', height: '650px' } }}
      />
    ),
    [handleOnChangeStructure, handleOnSave, molfile, setShow, show],
  );
}

export default StructureEditorModal;
