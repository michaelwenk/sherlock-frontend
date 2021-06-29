import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import Button from './Button';

type InputProps = {
  onClickCancel: Function;
  className?: string;
  classNameButton?: string;
};

function Spinner({
  onClickCancel,
  className = 'spinner',
  classNameButton,
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
        text="Cancel"
        onClick={onClickCancel}
        className={classNameButton}
      />
    </div>
  );
}

export default Spinner;
