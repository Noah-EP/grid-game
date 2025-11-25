import * as math from "mathjs";
import Matrix from "./Matrix";
import React from "react";
import Box from "./Box";
import HiddenBox from "./HiddenBox";
import BoxSelected from "./BoxSelected";
import BoxRevealed from "./BoxRevealed";
import BoxSelectedOutline from "./BoxSelectedOutline";
import { useRef, useState, useEffect } from "react";
import "../App";
import cloneDeep from "lodash.clonedeep";
import GridGenerator from "./GridGenerator";
import { e } from "mathjs";

// Represents a 10 x 18 grid of grid squares

export default function Grid(props) {
  // generates an array of 18 rows, each containing 10 GridSquares.

  const saveStateToLocalStorage = (ref, state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(ref, serializedState);
    } catch (error) {
      // Handle errors
    }
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

  const [boxStatus, setBoxStatus] = useState([]);
  const [tempBoxStatus, setTempBoxStatus] = useState([]);
  var grid = [];
  var loaded = false;
  var boxLoaded = false;
  var tempGrid = [];
  var changed = false;
  var boxOutlineArray = [];

  const fetchGeneratedGrid = async () => {
    try {
      const response = await fetch(
        "https://gridlinker-8e148.ew.r.appspot.com/api/gridGen"
      );
      const data = await response.json();
      return data.grid;
    } catch (error) {
      console.error("Error fetching grid:", error);
    }
  };
  const recreateGrid = (gridIn, gridOut) => {
    for (let row = 0; row < 10; row++) {
      gridOut.push([]);
      for (let col = 0; col < 5; col++) {
        if (gridIn[row][col].props.status == "revealedBox") {
          gridOut[row].push(
            <BoxRevealed
              status={gridIn[row][col].props.status}
              key={gridIn[row][col].props.index}
              index={gridIn[row][col].props.index}
              //val={Math.floor(Math.random() * (11 - 1) + 1)}
              val={gridIn[row][col].props.val}
              changeSelectionState={changeSelectionState}
            />
          );
        }
        if (gridIn[row][col].props.status == "selectedBox") {
          gridOut[row].push(
            <BoxSelected
              status={gridIn[row][col].props.status}
              key={gridIn[row][col].props.index}
              index={gridIn[row][col].props.index}
              //val={Math.floor(Math.random() * (11 - 1) + 1)}
              val={gridIn[row][col].props.val}
              changeSelectionState={changeSelectionState}
              origin={gridIn[row][col].props.origin}
            />
          );
        }

        if (gridIn[row][col].props.status == "selectedBoxOutline") {
          gridOut[row].push(
            <BoxSelectedOutline
              status={gridIn[row][col].props.status}
              key={gridIn[row][col].props.index}
              index={gridIn[row][col].props.index}
              //val={Math.floor(Math.random() * (11 - 1) + 1)}
              val={gridIn[row][col].props.val}
              changeSelectionState={changeSelectionState}
            />
          );
        }

        if (gridIn[row][col].props.status == "hiddenBox") {
          gridOut[row].push(
            <HiddenBox
              status={gridIn[row][col].props.status}
              key={gridIn[row][col].props.index}
              index={gridIn[row][col].props.index}
              //val={Math.floor(Math.random() * (11 - 1) + 1)}
              val={gridIn[row][col].props.val}
              changeSelectionState={changeSelectionState}
            />
          );
        }
      }
    }
    return gridOut;
  };
  const recreateBoxOutlineArray = (arrayIn) => {
    var arrayOut = [];

    for (var i in arrayIn) {
      arrayOut.push(
        <BoxSelectedOutline
          status={arrayIn[i].props.status}
          key={arrayIn[i].props.index}
          index={arrayIn[i].props.index}
          val={arrayIn[i].props.val}
          changeSelectionState={changeSelectionState}
        />
      );
    }

    return arrayOut;
  };

  const chooseNextBox = (row, col, tempGrid) => {
    var chooseSelectedBox = false;
    var surroundingBoxes = [];

    tempGrid[row][col] = (
      <BoxSelectedOutline
        status={"selectedBoxOutline"}
        key={`${row}${col}`}
        index={`${row}${col}`}
        val={tempGrid[row][col].props.val}
        changeSelectionState={changeSelectionState}
      />
    );
    boxOutlineArray.push(
      <BoxSelectedOutline
        status={"selectedBoxOutline"}
        key={`${row}${col}`}
        index={`${row}${col}`}
        val={tempGrid[row][col].props.val}
        changeSelectionState={changeSelectionState}
      />
    );

    updateBoxes(tempGrid, boxOutlineArray);
  };
  const updateBoxes = (tempGrid, boxOutlineArray) => {
    var boxChanged = true;
    var tempRow;
    var tempCol;
    var x = 0;
    var selectedFound;
    var tempBoxOutlineArray = loadStateFromLocalStorage("boxOutlineArray");

    while (boxChanged) {
      boxChanged = false;
      x = x + 1;

      for (var i = 0; i < boxOutlineArray.length; i++) {
        tempRow = parseInt(boxOutlineArray[i].props.index[0]);
        tempCol = parseInt(boxOutlineArray[i].props.index[1]);
        selectedFound = false;
        for (var tempRow2 = tempRow - 1; tempRow2 < tempRow + 2; tempRow2++) {
          if (tempGrid[tempRow2][tempCol].props.status == "selectedBox") {
            boxChanged = true;

            tempGrid[tempRow][tempCol] = (
              <BoxSelected
                status={tempGrid[tempRow2][tempCol].props.status}
                key={`${tempRow}${tempCol}`}
                index={`${tempRow}${tempCol}`}
                val={tempGrid[tempRow][tempCol].props.val}
                changeSelectionState={changeSelectionState}
                origin={tempGrid[tempRow2][tempCol].props.origin}
              />
            );

            selectedFound = true;

            boxOutlineArray.splice(i, 1);

            break;
          }
        }

        if (selectedFound == false) {
          for (var tempCol2 = tempCol - 1; tempCol2 < tempCol + 2; tempCol2++) {
            if (tempCol2 > -1 && tempCol2 < 5) {
              if (tempGrid[tempRow][tempCol2].props.status == "selectedBox") {
                boxChanged = true;

                tempGrid[tempRow][tempCol] = (
                  <BoxSelected
                    status={tempGrid[tempRow][tempCol2].props.status}
                    key={`${tempRow}${tempCol}`}
                    index={`${tempRow}${tempCol}`}
                    val={tempGrid[tempRow][tempCol].props.val}
                    changeSelectionState={changeSelectionState}
                    origin={tempGrid[tempRow][tempCol2].props.origin}
                  />
                );

                boxOutlineArray.splice(i, 1);

                break;
              }
            }
          }
        }
      }
    }

    boxLoaded = true;
    saveStateToLocalStorage("boxOutlineArray", boxOutlineArray);
  };
  const changeSelectionState = (index, val) => {
    var linked = false;
    var newGrid = GridGenerator();
    var colCount = 0;
    var colCountArray = [];
    var loadedGrid2 = [];
    var tempLoadedGrid2 = loadStateFromLocalStorage("grid");
    tempGrid = cloneDeep(grid);

    if (
      tempLoadedGrid2 != [] &&
      tempLoadedGrid2 != undefined &&
      loaded == false
    ) {
      loadedGrid2 = recreateGrid(tempLoadedGrid2, loadedGrid2);
      tempGrid = loadedGrid2;
      loaded = true;
    }

    for (let row = 0; row < 10; row++) {
      colCount = 0;
      for (let col = 0; col < 5; col++) {
        colCount = colCount + tempGrid[row][col].props.val;
      }
      colCountArray.push(colCount);
    }

    props.rowSum(colCountArray);
    saveStateToLocalStorage("colCount", colCountArray);

    if (props.boxCount >= 0) {
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 5; col++) {
          if (`${row}${col}` == index) {
            if (row < 1 || row > 8) {
              var boxOrigin;
              if (row < 1) {
                boxOrigin = 1;
              } else {
                boxOrigin = 2;
              }

              tempGrid[row][col] = (
                <BoxSelected
                  status={"selectedBox"}
                  key={`${row}${col}`}
                  index={`${row}${col}`}
                  val={tempGrid[row][col].props.val}
                  changeSelectionState={changeSelectionState}
                  origin={boxOrigin}
                />
              );

              updateBoxes(tempGrid, boxOutlineArray);
            } else {
              tempGrid[row][col] = (
                <BoxSelectedOutline
                  status={"selectedBoxOutline"}
                  key={`${row}${col}`}
                  index={`${row}${col}`}
                  val={tempGrid[row][col].props.val}
                  changeSelectionState={changeSelectionState}
                />
              );
              boxOutlineArray.push(
                <BoxSelectedOutline
                  status={"selectedBoxOutline"}
                  key={`${row}${col}`}
                  index={`${row}${col}`}
                  val={tempGrid[row][col].props.val}
                  changeSelectionState={changeSelectionState}
                />
              );

              updateBoxes(tempGrid, boxOutlineArray);
            }

            props.updateCounter(tempGrid[row][col].props.val);
            if (col + 1 < 5) {
              if (
                tempGrid[row][col + 1].props.status != "selectedBox" &&
                tempGrid[row][col + 1].props.status != "selectedBoxOutline"
              ) {
                tempGrid[row][col + 1] = (
                  <BoxRevealed
                    status={"revealedBox"}
                    key={`${row}${col + 1}`}
                    index={`${row}${col + 1}`}
                    val={tempGrid[row][col + 1].props.val}
                    changeSelectionState={changeSelectionState}
                  />
                );
              } else {
                if (
                  tempGrid[row][col + 1].props.origin !=
                  tempGrid[row][col].props.origin
                ) {
                  linked = true;
                }
              }
            }
            if (col - 1 > -1) {
              if (
                tempGrid[row][col - 1].props.status != "selectedBox" &&
                tempGrid[row][col - 1].props.status != "selectedBoxOutline"
              ) {
                tempGrid[row][col - 1] = (
                  <BoxRevealed
                    status={"revealedBox"}
                    key={`${row}${col - 1}`}
                    index={`${row}${col - 1}`}
                    val={tempGrid[row][col - 1].props.val}
                    changeSelectionState={changeSelectionState}
                  />
                );
              } else {
                if (
                  tempGrid[row][col - 1].props.origin !=
                  tempGrid[row][col].props.origin
                ) {
                  linked = true;
                }
              }
            }
            if (row + 1 < 10) {
              if (
                tempGrid[row + 1][col].props.status != "selectedBox" &&
                tempGrid[row + 1][col].props.status != "selectedBoxOutline"
              ) {
                tempGrid[row + 1][col] = (
                  <BoxRevealed
                    status={"revealedBox"}
                    key={`${row + 1}${col}`}
                    index={`${row + 1}${col}`}
                    val={tempGrid[row + 1][col].props.val}
                    changeSelectionState={changeSelectionState}
                  />
                );
              } else {
                if (
                  tempGrid[row + 1][col].props.origin !=
                  tempGrid[row][col].props.origin
                ) {
                  linked = true;
                }
              }
            }
            if (row - 1 > -1) {
              if (
                tempGrid[row - 1][col].props.status != "selectedBox" &&
                tempGrid[row - 1][col].props.status != "selectedBoxOutline"
              ) {
                tempGrid[row - 1][col] = (
                  <BoxRevealed
                    status={"revealedBox"}
                    key={`${row - 1}${col}`}
                    index={`${row - 1}${col}`}
                    val={tempGrid[row - 1][col].props.val}
                    changeSelectionState={changeSelectionState}
                  />
                );
              } else {
                if (
                  tempGrid[row - 1][col].props.origin !=
                  tempGrid[row][col].props.origin
                ) {
                  linked = true;
                }
              }
            }
          }
        }
      }
    }
    grid = tempGrid;

    setBoxStatus(tempGrid);
    saveStateToLocalStorage("grid", tempGrid);
    if (linked == true) {
      props.endGame();
      //localStorage.clear();
    }

    // The components generated in makeGrid are rendered in div.grid-board
  };

  useEffect(() => {
    var newGrid = [];
    var colCount = 0;
    var colCountArray = [];
    var loadedGrid = [];
    var tempLoadedGrid = loadStateFromLocalStorage("grid");

    fetchGeneratedGrid().then((gridData) => {
      // Now you can work with gridData
      newGrid = [gridData];

      for (let row = 0; row < 10; row++) {
        grid.push([]);
        for (let col = 0; col < 5; col++) {
          grid[row].push(
            <HiddenBox
              status={"hiddenBox"}
              key={`${row}${col}`}
              index={`${row}${col}`}
              //val={Math.floor(Math.random() * (11 - 1) + 1)}
              val={newGrid[0][row][col]}
              changeSelectionState={changeSelectionState}
            />
          );
        }
      }
      if (tempLoadedGrid != [] && tempLoadedGrid != undefined) {
        loadedGrid = recreateGrid(tempLoadedGrid, loadedGrid);
        boxOutlineArray = recreateBoxOutlineArray(
          loadStateFromLocalStorage("boxOutlineArray")
        );
        setBoxStatus(loadedGrid);
        props.rowSum(loadStateFromLocalStorage("colCount"));
      } else {
        setBoxStatus(grid);
        //console.log(grid[0][0]);
        //console.log  gridOut);
      }
    });
  }, []);

  return <div className="gridBoard">{boxStatus}</div>;
}
