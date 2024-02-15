import { useMainContext } from "../../hooks/useMainContext";
import { useMount } from "../../hooks/useMount";
import { setInitialHistory } from '../../api/openai';

import { FaTrashAlt } from "react-icons/fa";
import { RiLoopLeftFill } from "react-icons/ri";

import './Buttons.css'

const ResetButton = () => {
  const isMounted = useMount();

  return (
    <div
      className={`reset-button button-animations ${isMounted ? '' : 'hidden'}`}
      onClick={() => {
        setInitialHistory();
        alert('L\'historique de conversation a été réinitialisé avec succés');
      }}
    >
      <FaTrashAlt />
    </div>
  );
};

const LoopButton = () => {
  const isMounted = useMount();
  const {
    selfDiscussEnabled,
    setSelfDiscussedEnabled,
  } = useMainContext();
  
  return (
    <div
      className={`loop-button button-animations ${isMounted ? '' : 'hidden'}`}
      style={{backgroundColor: selfDiscussEnabled ? 'white' : '#1f1f24'}}
      onClick={() => setSelfDiscussedEnabled(!selfDiscussEnabled)}
    >
      <RiLoopLeftFill color={selfDiscussEnabled ? 'black' : 'white'} />
    </div>
  );
};

export const Buttons = () => (
    <>
      <ResetButton />
      <LoopButton />
    </>
)

export default Buttons