import { toBePartiallyChecked } from "@testing-library/jest-dom/dist/matchers";
import * as math from "mathjs";
import { useState } from "react";
import "../App";
import Grid from "./Grid";
import GridUpdater from "./GridUpdater";

function Box(props) {
  //let box = document.createElement('div');
  const [boxColour, setBoxColour] = useState(props.status);

  const onClickEvent = () => {
    setBoxColour("selectedBox");
    props.changeSelectionState(props.index);
  };

  return (
    <div onClick={onClickEvent} className={boxColour}>
      <div>{props.val}</div>
    </div>
  );
}

export default Box;
