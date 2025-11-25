import * as math from "mathjs";
import { useState } from "react";
import "../App";
import LeaderboardBox from "./LeaderboardBox";
import { useEffect } from "react";

function Leaderboard(props) {
  var leaderboardList = [];
  //let box = document.createElement('div');

  for (let i = 0; i < 5; i++) {
    if (i == Number(props.newScorePos)) {
      leaderboardList.push(
        <LeaderboardBox
          place={Number(props.newScorePos) + 1}
          names={props.newScoreName}
          scores={props.newScore}
          key={i}
          style={"userLeaderboardBoxStats"}
        ></LeaderboardBox>
      );
    } else {
      leaderboardList.push(
        <LeaderboardBox
          place={i + 1}
          names={props.topScores[i].playerName}
          scores={props.topScores[i].score}
          key={i}
          style={"leaderboardBoxStats"}
        ></LeaderboardBox>
      );
    }
  }
  console.log(props.newScorePos);
  if (props.newScorePos >= 5) {
    leaderboardList.push(
      <LeaderboardBox
        place={Number(props.newScorePos) + 1}
        names={props.newScoreName}
        scores={props.newScore}
        key={props.newScorePos}
        style={"userLeaderboardBoxStats"}
      ></LeaderboardBox>
    );
  }
  return <div className="leaderboard">{leaderboardList}</div>;
}

export default Leaderboard;
