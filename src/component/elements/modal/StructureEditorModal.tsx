import { useCallback, useMemo, useState } from 'react';
import { StructureEditor } from 'react-ocl/full';
import Button from '../Button';
import CustomModal from './CustomModal';
import { useDropzone } from 'react-dropzone';
import { Molecule } from 'openchemlib';

interface InputProps {
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSave: (molfile: string | undefined) => void;
  initialMolfile?: string;
}

function StructureEditorModal({
  onClose = () => {},
  onSave = () => {},
  initialMolfile,
}: InputProps) {
  // const [modifiedMolfile, setModifiedMolfile] = useState<string | undefined>();
  const [molfileToExport, setMolfileToExport] = useState<string | undefined>();

  const handleOnChangeStructure = useCallback(
    (_molfile: string) => setMolfileToExport(_molfile),
    [],
  );
  const handleOnClose = useCallback(() => onClose(), [onClose]);

  const handleOnSave = useCallback(() => {
    if (molfileToExport) {
      const molecule: Molecule = Molecule.fromMolfile(
        molfileToExport as string,
      );
      molecule.inventCoordinates();
      onSave(molecule.toMolfileV3());
    } else {
      onSave(molfileToExport);
    }
    handleOnClose();
  }, [handleOnClose, onSave, molfileToExport]);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // setModifiedMolfile(result);
        setMolfileToExport(result);
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noKeyboard: true,
  });

  return useMemo(
    () => (
      <CustomModal
        show={true}
        header="Draw or edit a fragment"
        body={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ border: '1px solid black', borderRadius: '10px' }}>
              <StructureEditor
                width={500}
                onChange={handleOnChangeStructure}
                initialMolfile={initialMolfile}
              />
            </div>
            <label
              style={{
                fontWeight: 'bold',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              OR
            </label>
            <div
              {...getRootProps()}
              style={{
                width: '100%',
                height: '50px',
                border: '1px solid black',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <label>Drop the MOL file here ...</label>
              ) : (
                <label>Drag & drop a MOL file to here</label>
              )}
            </div>
          </div>
        }
        footer={
          <div>
            <Button child="Cancel" onClick={handleOnClose} />
            <Button
              child="Save"
              onClick={handleOnSave}
              style={{ marginLeft: '20px' }}
            />
          </div>
        }
        modalStyle={{ content: { width: '550px', height: '700px' } }}
      />
    ),
    [
      getInputProps,
      getRootProps,
      handleOnChangeStructure,
      handleOnClose,
      handleOnSave,
      initialMolfile,
      isDragActive,
    ],
  );
}

export default StructureEditorModal;
