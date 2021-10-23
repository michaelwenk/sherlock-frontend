import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import Button from './Button';

type InputProps = {
  onClickCancel: Function;
  className?: string;
  classNameButton?: string;
  text?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
};

function Spinner({
  onClickCancel,
  className = 'spinner',
  classNameButton,
  text,
  buttonText = 'Cancel',
  buttonDisabled = false,
  ...props
}: InputProps) {
  return (
    <div className={className}>
      <Loader
        type="Watch"
        color="#00BFFF"
        height="100px"
        width="100px"
        {...props}
      />
      <p style={{ marginTop: 10 }}>{text}</p>
      <Button
        text={buttonText}
        onClick={onClickCancel}
        className={classNameButton}
        disabled={buttonDisabled}
      />
    </div>
  );
}

export default Spinner;
