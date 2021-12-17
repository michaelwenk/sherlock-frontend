import { FaExclamation } from 'react-icons/fa';

interface InputProps {
  message: string;
}

function ErrorSymbol({ message }: InputProps) {
  return (
    <FaExclamation
      className="error-icon"
      style={{ color: 'red' }}
      title={message}
    />
  );
}

export default ErrorSymbol;
