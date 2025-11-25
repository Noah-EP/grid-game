import * as math from "mathjs";
import { useEffect, useState } from "react";
import "../App";
import Grid from "./Grid";
import GridUpdater from "./GridUpdater";

function Box(props) {
  //let box = document.createElement('div');
  const [isExpanding, setIsExpanding] = useState(false);

  const [boxColour, setBoxColour] = useState(props.status);

  useEffect(() => {
    //setBoxColour("selectedBox");
    //props.changeSelectionState(props.index);
    setIsExpanding(true);

    // Remove the expand-retract class after the animation is complete
    setTimeout(() => {
      setIsExpanding(false);
    }, 300); // 0.3 seconds, which matches the animation duration
  }, []);

  const tt = () => {};
  return (
    <div className={`${"selectedBox"} ${isExpanding ? "expand-retract" : ""}`}>
      <div>{props.val}</div>
    </div>
  );
}

export default Box;
