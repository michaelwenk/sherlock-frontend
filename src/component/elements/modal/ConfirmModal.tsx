import CustomModal from './CustomModal';
import Button from '../Button';

interface InputProps {
  show: boolean;
  title: string;
  onCancel: Function;
  onConfirm: Function;
}

function ConfirmModal({ show, title, onCancel, onConfirm }: InputProps) {
  return (
    <CustomModal
      show={show}
      title={title}
      onClose={onCancel}
      footer={
        <div>
          <Button child="Cancel" onClick={onCancel} className="footer-button" />
          <Button
            child="Confirm"
            onClick={onConfirm}
            className="footer-button"
          />
        </div>
      }
    />
  );
}

export default ConfirmModal;
