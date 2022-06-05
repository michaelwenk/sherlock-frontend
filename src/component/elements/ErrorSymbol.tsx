import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { useMemo } from 'react';

interface InputProps {
  message: string;
}

function ErrorSymbol({ message }: InputProps) {
  return useMemo(
    () => (
      <FontAwesomeIcon
        icon={faExclamation}
        className="error-icon"
        style={{ color: 'red' }}
        title={message}
      />
    ),
    [message],
  );
}

export default ErrorSymbol;
