import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import Button from './Button';

type InputProps = {
  onClickCancel: Function;
  className?: string;
  classNameButton?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
};

function Spinner({
  onClickCancel,
  className = 'spinner',
  classNameButton,
  buttonText = 'Cancel',
  buttonDisabled = false,
  ...props
}: InputProps) {
  return (
    <div className={className}>
      <Loader
        type="TailSpin"
        color="#00BFFF"
        height="100px"
        width="100px"
        {...props}
      />
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
