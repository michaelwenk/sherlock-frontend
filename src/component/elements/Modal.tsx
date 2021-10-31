import './Modal.scss';

import { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Button from '../elements/Button';
interface InputProps {
  show: boolean;
  title: string;
  children: JSX.Element;
  onClose: Function;
}

function Modal({ show, title, children, onClose }: InputProps) {
  const handleOnClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOnPressEscape = useCallback(
    (e) => {
      if ((e.charCode || e.keyCode) === 27) {
        e.preventDefault();
        e.stopPropagation();
        handleOnClose();
      }
    },
    [handleOnClose],
  );

  useEffect(() => {
    if (show) {
      document.body.addEventListener('keydown', handleOnPressEscape);
    } else {
      document.body.removeEventListener('keydown', handleOnPressEscape);
    }

    return function cleanup() {
      document.body.removeEventListener('keydown', handleOnPressEscape);
    };
  }, [handleOnPressEscape, show]);

  return ReactDOM.createPortal(
    <CSSTransition in={show} unmountOnExit timeout={{ enter: 0, exit: 300 }}>
      <div className="modal" onClick={handleOnPressEscape}>
        <div
          className="modal-content"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="modal-header">
            <p>{title}</p>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <Button child="Close" onClick={handleOnClose} />
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById('root') as HTMLElement,
  );
}

export default Modal;
