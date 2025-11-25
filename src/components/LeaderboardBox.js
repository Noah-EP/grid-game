import * as math from "mathjs";
import { useState } from "react";
import "../App";

function LeaderboardBox(props) {
  //let box = document.createElement('div');

  return (
    <div className="leaderboardBox">
      <div className="leaderboardBoxNum">
        <div className="placeNum">{props.place}</div>
      </div>
      <div className={props.style}>
        <div className="highscoreName">{props.names.substring(0, [10])} </div>
        <div className="highscoreScore">
          <b>
            {"Score: "}
            {props.scores}
          </b>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardBox;
