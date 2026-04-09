import CustomModal from './CustomModal';
import Button from '../Button';
import { ReactNode } from 'react';

interface InputProps {
  show: boolean;
  header: ReactNode | undefined | null;
  onCancel: () => void;
  onConfirm: () => void;
  body?: ReactNode | undefined | null;
}
function ConfirmModal({ show, header, onCancel, onConfirm, body }: InputProps) {
  return (
    <CustomModal
      show={show}
      header={header}
      onClose={onCancel}
      body={body}
      footer={
        <div>
          <Button child="Cancel" onClick={onCancel} />
          <Button child="Confirm" onClick={onConfirm} />
        </div>
      }
    />
  );
}

export default ConfirmModal;
