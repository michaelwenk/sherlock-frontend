import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomModal.scss';

import { useCallback, useRef } from 'react';
import Button from '../../elements/Button';
import Modal from 'react-bootstrap/Modal';
interface InputProps {
  show: boolean;
  title: string;
  showCloseButton?: boolean;
  onClose?: Function;
  body?: JSX.Element;
  footer?: JSX.Element | undefined | null;
}

function CustomModal({
  show,
  title,
  onClose,
  showCloseButton = onClose !== undefined,
  body,
  footer = showCloseButton ? (
    <Button child="Close" onClick={onClose ? onClose : () => {}} />
  ) : null,
}: InputProps) {
  const modalRef = useRef<any>();

  const handleOnClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <Modal
      ref={modalRef}
      show={show}
      onHide={handleOnClose}
      animation={false}
      dialogClassName="custom-modal"
    >
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>
            <p>{title}</p>
          </Modal.Title>
        </Modal.Header>
        {body && <Modal.Body>{body}</Modal.Body>}
        {footer && <Modal.Footer>{<div>{footer}</div>}</Modal.Footer>}
      </Modal.Dialog>
    </Modal>
  );
}

export default CustomModal;
