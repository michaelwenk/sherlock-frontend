import CustomModal from './CustomModal';
import Button from '../Button';

interface InputProps {
  show: boolean;
  header: JSX.Element | string | undefined | null;
  onCancel: Function;
  onConfirm: Function;
  body?: JSX.Element | string | undefined | null;
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
