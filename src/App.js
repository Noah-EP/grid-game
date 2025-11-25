import Matrix from "./components/Matrix";
import Box from "./components/Box";
import Grid from "./components/Grid";
import Counter from "./components/Counter";
import "./App.css";
import RowCount from "./components/RowCount";
import { useState, useEffect } from "react";
import BounceElement from "./components/bounce";
import TopNavBar from "./components/TopNavBar";
import Leaderboard from "./components/Leaderboard";
import ReactModal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";

function App() {
  const saveStateToLocalStorage = (ref, state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(ref, serializedState);
    } catch (error) {}
  };

  const loadStateFromLocalStorage = (ref) => {
    try {
      const serializedState = localStorage.getItem(ref);
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (error) {
      return undefined;
    }
  };

  const [boxCount, setBoxCount] = useState(0);
  const [newRowSum, setNewRowSum] = useState([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [gameStatModalStatus, setGameStatModalStatus] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [bestScore, setBestScore] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  const [isBouncing, setIsBouncing] = useState(false);
  const [isClipVisible, setIsClipVisible] = useState(false);
  const [isShareBouncing, setIsShareBouncing] = useState(false);
  const [isBestScore, setIsBestScore] = useState(false);
  const [isFormModal, setIsFormModal] = useState(false);
  const [scorePos, setScorePos] = useState(0);
  const [top5, setTop5] = useState([]);
  //var newRowSum;
  var count = 0;
  var loaded = false;
  var tempBestScore = 0;
  var initDay;
  var shareScorePos;

  const handleBounceEffect = () => {
    setIsBouncing(true);

    // Remove the bounce class after the animation is complete
    // setTimeout(() => {
    //setIsBouncing(false);
    // }, 600); // 0.6 seconds, which matches the animation duration
  };

  const handleShare = () => {
    setIsShareBouncing(true);
    setIsClipVisible(true);
    shareScorePos = Number(scorePos) + 1;
    navigator.clipboard.writeText(
      "GridLinker🟪⬜\n                ⬜🟪\n" +
        inputValue +
        "'s Score:" +
        boxCount +
        "\nGlobal Ranking: (" +
        shareScorePos +
        ")" +
        "\nToday's Lowest Score: " +
        bestScore +
        "\nPlay Now: https://gridlinker.web.app/"
    );

    // Remove the bounce class after the animation is complete

    setTimeout(() => {
      setIsShareBouncing(false);
    }, 600); // 0.6 seconds, which matches the animation duration

    setTimeout(() => {
      setIsClipVisible(false);
    }, 1000); // Adjust the duration of the fade
  };

  const updateCounter = (val) => {
    count = count + val;
    setBoxCount(count);
    saveStateToLocalStorage("score", count);
  };
  const getRowSum = (rowSum) => {
    //setNewRowSum(rowSum);
    setNewRowSum(rowSum);
  };

  const closeModal = () => {
    setGameStatModalStatus(false);
  };
  const openFormModal = () => {
    setTimeout(() => {
      setIsFormModal(true);
    }, 1100); // 0.6 seconds, which matches the animation duration
  };
  const closeFormModal = () => {
    setIsFormModal(false);
    submitScore();
    fetchBestScore();
    fetchAverageScore();
  };
  const loadGameStatsModal = () => {
    setIsShareBouncing(true);
    setIsClipVisible(true);
    submitScore();
    fetchBestScore();
    fetchAverageScore();

    setTimeout(() => {
      fetchScorePos().then(() => {
        fetchTop5().then(() => {
          setIsShareBouncing(false);
          setIsClipVisible(false);
          setGameStatModalStatus(true);
          setIsFormModal(false);
        });
      });
    }, 3000);
  };
  const loadLeaderboardOnly = () => {
    fetchScorePos().then(() => {
      fetchTop5().then(() => {
        setGameStatModalStatus(true);
      });
    });
  };
  const openModal = () => {
    handleBounceEffect();
    if (count < tempBestScore) {
      setIsBestScore(true);
    }

    submitScore();
    fetchBestScore();
    fetchAverageScore();

    setTimeout(() => {
      setGameStatModalStatus(true);
    }, 1100); // 0.6 seconds, which matches the animation duration
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const fetchWithRetry = async (
    url,
    options = {},
    maxAttempts = 5,
    delay = 1000
  ) => {
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        const res = await fetch(url, options);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        return res; // success → return fetch response
      } catch (err) {
        attempt++;

        console.error(`Fetch attempt ${attempt} failed for ${url}:`, err);

        if (attempt >= maxAttempts) {
          throw new Error(
            `fetchWithRetry: Failed after ${maxAttempts} attempts`
          );
        }

        await new Promise((res) => setTimeout(res, delay)); // wait
      }
    }
  };

  const submitScore = async () => {
    const response = await fetch(
      "https://gridlinker-8e148.ew.r.appspot.com/api/scores",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: inputValue,
          score: count,
          timestamp: new Date().getDay().toString(),
        }),
      }
    );

    if (response.ok) {
      const responseData = await response.json(); // Parse the JSON response
    }
  };

  const fetchAverageScore = async () => {
    try {
      const response = await fetch(
        "https://gridlinker-8e148.ew.r.appspot.com/api/meanScore"
      );
      const data = await response.json();
      setAverageScore(data.meanScore);
    } catch (error) {
      console.error("Error fetching highest score:", error);
      window.location.reload();
    }
  };

  const fetchBestScore = async () => {
    try {
      const response = await fetch(
        "https://gridlinker-8e148.ew.r.appspot.com/api/bestScore"
      );
      const data = await response.json();
      setBestScore(data.bestScore);
      tempBestScore = data.bestScore;
    } catch (error) {
      console.error("Error fetching highest score:", error);
      window.location.reload();
    }
  };

  const fetchDaySinceInit = async () => {
    try {
      const response = await fetch(
        "https://gridlinker-8e148.ew.r.appspot.com/api/day"
      );
      const data = await response.json();
      initDay = data.day;
    } catch (error) {
      window.location.reload(false);
      console.error("Error fetching highest day:", error);
      window.location.reload();
    }
  };

  const fetchTop5 = async () => {
    try {
      const response = await fetch(
        "https://gridlinker-8e148.ew.r.appspot.com/api/top5"
      );
      const data = await response.json();
      setTop5(data.top5);
    } catch (error) {
      console.error("Error fetching top5:", error);
      window.location.reload();
    }
  };

  const fetchScorePos = async () => {
    try {
      const response = await fetch(
        "https://gridlinker-8e148.ew.r.appspot.com/api/position"
      );
      const data = await response.json();
      setScorePos(data.scorePos);
    } catch (error) {
      console.error("Error fetching scorePos:", error);
      window.location.reload();
    }
  };

  useEffect(() => {
    if (loadStateFromLocalStorage("score") != undefined) {
      count = loadStateFromLocalStorage("score");
      setBoxCount(count);
    }
    setGameFinished(loadStateFromLocalStorage("disableGame"));

    fetchDaySinceInit().then(() => {
      if (
        initDay != loadStateFromLocalStorage("initDay") &&
        initDay != undefined
      ) {
        localStorage.clear();
      }

      saveStateToLocalStorage("initDay", initDay);

      fetchAverageScore();
      fetchBestScore();
    });
  });

  return (
    <div className="main">
      <TopNavBar />

      <div className="game">
        <ReactModal className="endGameStats" isOpen={isFormModal}>
          <div className="endGameStatsContainer">
            <button className="closeButton" onClick={() => closeFormModal()}>
              &times;
            </button>
            <div className="modalText1">Your Score: {boxCount}</div>
            <div className="modalText2">
              {" "}
              Submit your score to view the leaderboard!
            </div>
            <form>
              <input
                className="modalText4"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter Username"
              />
              <button
                type="button"
                className={
                  isShareBouncing ? "shareButtonBounce" : "shareButton"
                }
                onClick={() => loadGameStatsModal()}
              >
                {" Submit Score"}
              </button>
            </form>
            {isClipVisible && (
              <div className="fadeIn">
                <div className="clipboardText">Loading Leaderboard...</div>
              </div>
            )}
          </div>
        </ReactModal>

        <ReactModal className="endGameLeaderboard" isOpen={gameStatModalStatus}>
          <div>
            <button className="closeButton" onClick={() => closeModal()}>
              &times;
            </button>
            <div className="modalText1">Leaderboard:</div>

            <div>
              <Leaderboard
                topScores={top5}
                newScorePos={scorePos}
                newScore={boxCount}
                newScoreName={inputValue}
              ></Leaderboard>
            </div>
            <div className={isBestScore ? "highScore" : "highScoreHidden"}>
              New Low Score!
            </div>
            <div className="modalText5">
              Daily Average Score: {averageScore}
            </div>
            <button
              type="button"
              className={isShareBouncing ? "shareButtonBounce" : "shareButton"}
              onClick={() => handleShare()}
            >
              <FontAwesomeIcon icon={faShareFromSquare} />
              {" Share Score"}
            </button>

            {isClipVisible && (
              <div className="fadeInOut">
                <div className="clipboardText">Copied to Clipboard</div>
              </div>
            )}
          </div>
        </ReactModal>

        <div
          className={` ${
            isBouncing ? "revealGameComplete" : "hiddenGameComplete"
          }`}
        >
          {"Puzzle Complete!"}
        </div>
        <div className="topBox">
          <div className="playerScore">Score:</div>
          <Counter counter={boxCount} />
          <div className="playerScore2">Lower is better...</div>
        </div>

        <div className={gameFinished ? "mainContentDisabled" : "mainContent"}>
          <Grid
            updateCounter={updateCounter}
            boxCount={boxCount}
            rowSum={getRowSum}
            endGame={() => {
              setGameFinished(true);
              saveStateToLocalStorage("disableGame", true);

              openFormModal();
            }}
          />
          <RowCount inputRowSum={newRowSum}></RowCount>
        </div>
        <div
          className={gameFinished ? "bottomBoxButton" : "bottomBox"}
          onClick={() => {
            if (gameFinished) {
              loadLeaderboardOnly();
            }
          }}
        >
          <div className="pastScores">Daily Average: {averageScore} </div>
          <div className="pastScores">Daily Lowest: {bestScore}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
