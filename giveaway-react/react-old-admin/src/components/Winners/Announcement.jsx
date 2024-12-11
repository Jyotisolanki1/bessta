import { useEffect, useState } from "react";
import Roulette from "./Roulette";

import { fetchParticipitants , fetchWinners } from "../../slices/WinnerSlice";
import { useDispatch } from "react-redux";

export default function Announcement({drawid}) {
  const [count, setCount] = useState(3);
  const [handleBtnCount, setHandleBtnCount] = useState(true);
  const [participitants , setParticipitants] = useState('')
  const [winner , setWinner ] = useState('')

  const dispatch  = useDispatch()
  // const {loader , }

//  Count Down Component 10 , 9 , 8 ,  7 ....

  function CountDown() {
    useEffect(() => {
      const countDownInterval = setInterval(() => {
        setCount((prevState) => prevState - 1);
      }, 1000);

      return () => clearInterval(countDownInterval);
    }, []);

    return (
      <div>
        <h2 style={{ fontSize: "200px", color: "#13375b" }}>{count}</h2>
      </div>
    );
  }

  const handleClickStart =  async () => {
    setHandleBtnCount(false);
    const participitantsResponse = await dispatch(fetchParticipitants(drawid))

    const winnerResponse = await dispatch(fetchWinners(drawid))
   
    setParticipitants(participitantsResponse?.payload?.data)

    setWinner(winnerResponse?.payload?.data)
  };

//   Rendereing The Screen COunt Down and Spinner , start & stop 

  if (count === 0) {
    return <Roulette participitants = {participitants} winner = {winner}/>;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {handleBtnCount ? (
        <button onClick={handleClickStart}>Start Revel Btn</button>
      ) : (
        <CountDown />
      )}
    </div>
  );
}
