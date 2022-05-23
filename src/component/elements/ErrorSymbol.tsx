import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

interface InputProps {
  message: string;
}

function ErrorSymbol({ message }: InputProps) {
  return (
    <FontAwesomeIcon
      icon={faExclamation}
      className="error-icon"
      style={{ color: 'red' }}
      title={message}
    />
  );
}

export default ErrorSymbol;
