import { useCallback, useMemo, useState } from 'react';
import { StructureEditor } from 'react-ocl/full';
import Button from '../Button';
import CustomModal from './CustomModal';
import { useDropzone } from 'react-dropzone';
import { Molecule } from 'openchemlib';
import { getAtomCounts } from 'nmr-correlation';

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
  const [molfile, setMolfile] = useState<string | undefined>(initialMolfile);
  const [molfileToExport, setMolfileToExport] = useState<string | undefined>(
    initialMolfile,
  );
  const [error, setError] = useState<string | undefined>();

  const handleOnChangeStructure = useCallback(
    (_molfile: string) => setMolfileToExport(_molfile),
    [],
  );

  const molecule = useMemo(() => {
    const molecule: Molecule = Molecule.fromMolfile(molfileToExport as string);
    const atomCounts = getAtomCounts(molecule.getMolecularFormula().formula);
    if (
      Object.keys(atomCounts).length > 0 &&
      !Object.keys(atomCounts).includes('R')
    ) {
      setError('Fragment should contain at least one R (open site)');
    } else {
      setError(undefined);
    }

    return molecule;
  }, [molfileToExport]);

  const handleOnClose = useCallback(() => onClose(), [onClose]);

  const handleOnSave = useCallback(() => {
    if (molfileToExport) {
      molecule.inventCoordinates();
      onSave(molecule.toMolfileV3());
    } else {
      onSave(molfileToExport);
    }
    handleOnClose();
  }, [molfileToExport, handleOnClose, molecule, onSave]);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setMolfile(result);
      setMolfileToExport(result);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noKeyboard: true,
  });

  const structureEditor = useMemo(
    () => (
      <StructureEditor
        width={500}
        onChange={handleOnChangeStructure}
        initialMolfile={molfile}
        key={Math.random()}
      />
    ),
    [handleOnChangeStructure, molfile],
  );

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
              {structureEditor}
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
                height: '30px',
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
                <label>Drag & drop a MOL file or click here</label>
              )}
            </div>
            {error && (
              <label style={{ color: 'red', marginTop: '10px' }}>{error}</label>
            )}
          </div>
        }
        footer={
          <div>
            <Button child="Cancel" onClick={handleOnClose} />
            <Button
              child="Save"
              onClick={handleOnSave}
              style={{ marginLeft: '20px', color: error ? 'grey' : 'inherit' }}
              disabled={error !== undefined}
            />
          </div>
        }
        modalStyle={{ content: { width: '550px', height: '700px' } }}
      />
    ),
    [
      error,
      getInputProps,
      getRootProps,
      handleOnClose,
      handleOnSave,
      isDragActive,
      structureEditor,
    ],
  );
}

export default StructureEditorModal;
