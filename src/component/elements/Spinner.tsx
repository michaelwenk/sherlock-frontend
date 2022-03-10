import './Spinner.scss';
import Button from './Button';
import { useEffect, useState } from 'react';
import { TailSpin } from 'react-loader-spinner';

type InputProps = {
  onClickCancel?: Function;
  className?: string;
  classNameButton?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
  showTimer?: boolean;
};

function Spinner({
  onClickCancel = () => {},
  className = 'Spinner',
  classNameButton,
  buttonText = 'Cancel',
  buttonDisabled = false,
  showTimer,
  ...props
}: InputProps) {
  const [timer, setTimer] = useState<{
    totalSeconds: number;
    seconds: number;
    minutes: number;
  }>({
    totalSeconds: 0,
    seconds: 0,
    minutes: 0,
  });

  useEffect(() => {
    if (showTimer) {
      const timeout = setTimeout(function () {
        const totalSeconds = timer.totalSeconds + 1;
        const seconds = totalSeconds % 60;
        const minutes = Math.floor(totalSeconds / 60);
        setTimer({ totalSeconds, seconds, minutes });
      }, 1000);

      // clear timeout if the component is unmounted
      return () => clearTimeout(timeout);
    }
  }, [showTimer, timer]);

  return (
    <div className={className}>
      <TailSpin color="#00BFFF" height="100px" width="100px" {...props} />
      {showTimer && (
        <p
          style={{ marginTop: 10 }}
        >{`${timer.minutes} min : ${timer.seconds} s`}</p>
      )}
      {buttonText && onClickCancel && (
        <Button
          child={buttonText}
          onClick={onClickCancel}
          className={classNameButton}
          disabled={buttonDisabled}
          style={
            buttonDisabled
              ? { border: 'none', backgroundColor: 'transparent' }
              : {}
          }
        />
      )}
    </div>
  );
}

export default Spinner;
