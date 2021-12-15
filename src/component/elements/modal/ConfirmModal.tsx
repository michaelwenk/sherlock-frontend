import CustomModal from './CustomModal';
import Button from '../Button';

interface InputProps {
  show: boolean;
  title: string;
  onCancel: Function;
  onConfirm: Function;
  body?: JSX.Element;
}

function ConfirmModal({ show, title, onCancel, onConfirm, body }: InputProps) {
  return (
    <CustomModal
      show={show}
      title={title}
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
