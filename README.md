# GridLinker

Gridlinker is a web puzzle game developed with react.js, developed as a personal project to improve my react.js and javascript knowledge. The game can be played here: [GridLinker Game](https://gridlinker.web.app/)

## How to play:

- The game consists of a grid of boxes containing (hidden) random numbers.
- When a box is selected the number in the box is added to the score, and the numbers in the surrounding boxes are revealed.
- The aim of the game is to select boxes to draw a path from the top of the grid to the bottom with the lowest possible score.
- All players are given the same grid, which resets daily, and can compare their scores on a global leaderboard.

This repo contains the frontend for gridLinker. GridLinker is deployed as a firebase app.

## Dependencies:

- "@fortawesome/free-solid-svg-icons": "^6.4.2",
- "@fortawesome/react-fontawesome": "^0.2.0",
- "@testing-library/jest-dom": "^5.16.3",
- "@testing-library/react": "^12.1.4",
- "@testing-library/user-event": "^13.5.0",
- "firebase": "^10.4.0",
- "lodash": "^4.17.21",
- "lodash.clonedeep": "^4.5.0",
- "mathjs": "^10.4.2",
- "react": "^18.0.0",
- "react-dom": "^18.0.0",
- "react-modal": "^3.16.1",
- "react-scripts": "5.0.0",
- "reactjs-modal": "^4.0.0",
- "reactjs-popup": "^2.0.5",
- "web-vitals": "^2.1.4"

See https://github.com/Lotoke/gridLinkerServer for backend, which handles grid number generation and player scores