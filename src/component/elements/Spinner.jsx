import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

function Spinner({ ...props }) {
  return (
    <Loader
      type="TailSpin"
      color="#00BFFF"
      height="100px"
      width="100px"
      {...props}
    />
  );
}

export default Spinner;
