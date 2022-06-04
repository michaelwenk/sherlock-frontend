import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomModal.scss';

import { CSSProperties, useCallback, useRef } from 'react';
import Button from '../../elements/Button';
import Modal from 'react-modal';
import ReactModal from 'react-modal';

Modal.setAppElement('#root');

const defaultModalStyle: ReactModal.Styles = {
  overlay: {},
  content: {
    width: '500px',
    height: '300px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const defaultElementStyle: CSSProperties = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '20px',
};

interface InputProps {
  show: boolean;
  header?: JSX.Element | string | undefined | null;
  showCloseButton?: boolean;
  onClose?: Function;
  body?: JSX.Element | string | undefined | null;
  footer?: JSX.Element | undefined | null;
  modalStyle?: ReactModal.Styles;
  headerContainerStyle?: CSSProperties;
  bodyContainerStyle?: CSSProperties;
  footerContainerStyle?: CSSProperties;
}

function CustomModal({
  show,
  header,
  onClose,
  showCloseButton = onClose !== undefined,
  body,
  footer = showCloseButton ? (
    <Button child="Close" onClick={onClose ? onClose : () => {}} />
  ) : null,
  modalStyle = defaultModalStyle,
  headerContainerStyle,
  bodyContainerStyle,
  footerContainerStyle,
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
      isOpen={show}
      style={{
        content: { ...defaultModalStyle.content, ...modalStyle.content },
        overlay: { ...defaultModalStyle.overlay, ...modalStyle.overlay },
      }}
      onRequestClose={handleOnClose}
    >
      <div>
        <div
          style={{
            ...defaultElementStyle,
            fontWeight: 'bold',
            ...headerContainerStyle,
          }}
        >
          {header}
        </div>
        <div style={{ ...defaultElementStyle, ...bodyContainerStyle }}>
          {body}
        </div>
        <div style={{ ...defaultElementStyle, ...footerContainerStyle }}>
          {footer}
        </div>
      </div>
    </Modal>
  );
}

export default CustomModal;
